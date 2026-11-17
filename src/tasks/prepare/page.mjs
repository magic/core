import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'
import transmute from '@magic/transmute'
import is from '@magic/types'

import { replaceSlashSlash, saveImport } from '../../lib/index.mjs'

/** @import { Config, PageObject, ModuleView, NodeError } from '../../types.mjs' */

/**
 * @param {{ WEB_ROOT?: string, pageDir: string, state?: Record<string, unknown>, config: Config }} params
 * @returns {(file: string) => Promise<PageObject | undefined>}
 */
export const preparePage =
  ({ WEB_ROOT, pageDir, state = {}, config }) =>
  async file => {
    const ext = path.extname(file)

    const markdownExtensions = ['.md', '.markdown']
    const htmlExtensions = ['.html', '.htm']

    /** @type {Record<string, unknown> & { rendered?: string, originalState?: unknown }} */
    let transmuted = {}

    if (markdownExtensions.includes(ext)) {
      const content = await fs.readFile(file, 'utf8')
      transmuted = transmute.markdown(content, state)
      file = file.replace('.md', '.mjs').replace('.markdown', '.mjs')
    } else if (htmlExtensions.includes(ext)) {
      const content = await fs.readFile(file, 'utf8')
      transmuted = transmute.html(content, state)
      file = file.replace('.html', '.mjs').replace('.htm', '.mjs')
    }

    /** @type {Record<string, unknown> | Error | undefined} */
    let pageTmp
    if (!is.empty(transmuted)) {
      const viewString = `export const View = state => [${transmuted.rendered}]`

      const fileTmpPath = path.join(config.TMP_DIR, file.replace(pageDir, ''))

      const subDir = path.dirname(fileTmpPath)
      await fs.mkdirp(subDir)

      await fs.writeFile(fileTmpPath, viewString)
      pageTmp = await saveImport(fileTmpPath)
    } else {
      try {
        pageTmp = await saveImport(file)
      } catch (e) {
        if (is.error(e) && /** @type {NodeError} */ (e).code === 'ERR_UNKNOWN_FILE_EXTENSION') {
          log.warn('UNKNOWN_FILE_TYPE', `${file} is not an es6 component. Ignored.`)
          return
        }
        if (e instanceof Error) {
          throw e
        }
        throw new Error(String(e), { cause: e })
      }
    }

    /** @type {PageObject} */
    let page = {
      state: {},
    }

    if (is.fn(pageTmp)) {
      page = /** @type {PageObject} */ ({
        ...transmuted,
        View: /** @type {ModuleView} */ (pageTmp),
      })
    } else if (transmuted) {
      const { rendered: _rendered, ...t } = transmuted
      /** @type {Record<string, unknown>} */
      const importedPage = is.undefined(pageTmp) || pageTmp instanceof Error ? {} : pageTmp
      page = /** @type {PageObject} */ ({ ...t, ...importedPage })
    } else {
      /** @type {Record<string, unknown>} */
      const importedPage = is.undefined(pageTmp) || pageTmp instanceof Error ? {} : pageTmp
      page = /** @type {PageObject} */ ({ ...importedPage })
    }

    page.file = file.replace(/\\/gim, '/')

    // has to be initialized!
    // we also have to make sure to create a copy,
    // page.state may have been imported from a module
    // and that would lead to recursion in lib/stringifyObject
    if (page.state) {
      page.state = { ...page.state }
    } else {
      page.state = {}
    }

    if (!is.empty(transmuted.originalState)) {
      if (is.fn(transmuted.originalState)) {
        transmuted.originalState = transmuted.originalState(config)
      }

      if (is.objectNative(transmuted.originalState)) {
        page.state = {
          ...page.state,
          ...transmuted.originalState,
        }
      }
    }

    const pageName = file
      .replace(pageDir, '')
      .replace(/index.[m]?js/gm, '')
      .replace(/.[m]?js/gm, '/')
      .replace(/\\/gim, '/')

    page.name = replaceSlashSlash(`${WEB_ROOT}${pageName}`)

    page.path = page.name

    if (page.path.endsWith('/')) {
      if (page.name === '/404/') {
        // page path for 404 is /404.html, not /404/index.html
        page.path = `${page.path.slice(0, -1)}.html`
      } else {
        page.path = `${page.path}index.html`
      }
    }

    if (!page.View || !is.function(page.View.toString)) {
      const relativePageDir = pageDir.replace(process.cwd(), '')
      // remove all slashes
      const pageName = page.name.replace(/\//g, '')

      throw error(
        `
${relativePageDir}/${pageName}.mjs
needs to
export const View = state => []
`,
        'E_INVALID_PAGE',
      )
    }

    return page
  }
