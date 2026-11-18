import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import transmute from '@magic/transmute'
import is from '@magic/types'

import { replaceSlashSlash, saveImport } from '../../lib/index.mjs'

/** @import { Config, PageObject, ModuleView } from '../../types.mjs' */

/**
 * @param {{ root?: string, pageDir: string, state?: Record<string, unknown>, config: Config }} params
 * @returns {(file: string) => Promise<PageObject | undefined>}
 */
export const prepareBlogPost =
  ({ pageDir, state = {}, config }) =>
  async file => {
    const { TMP_DIR } = config
    // the caller only runs this for blog files, so BLOG_DIR is set
    const BLOG_DIR = /** @type {string} */ (config.BLOG_DIR)

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

    /** @type {string | undefined} */
    let viewString

    /** @type {Record<string, unknown> | Error | undefined} */
    let pageTmp
    if (!is.empty(transmuted)) {
      viewString = `export const View = state => BlogPost(state, [${transmuted.rendered}])`

      // key the tmp file by the post's path relative to the blog dir, not just
      // its basename: posts in different dirs often share a basename (index.md
      // archives, same-named posts) and are prepared in parallel
      const fileTmpPath = path.join(TMP_DIR, file.replace(pageDir, ''))
      await fs.mkdirp(path.dirname(fileTmpPath))
      await fs.writeFile(fileTmpPath, viewString)
      pageTmp = await saveImport(fileTmpPath)
    } else {
      pageTmp = await saveImport(file)

      /** @type {string | string[]} */
      let children = []
      if (is.fn(pageTmp)) {
        children = pageTmp.toString().split('=>')[1]
      } else if (!is.error(pageTmp) && is.fn(pageTmp.View)) {
        children = pageTmp.View.toString().split('=>')[1]
      }

      viewString = `export const View = state => BlogPost(state, ${children})`

      const fileTmpPath = path.join(TMP_DIR, file.replace(pageDir, ''))
      await fs.mkdirp(path.dirname(fileTmpPath))
      await fs.writeFile(fileTmpPath, viewString)
      pageTmp = await saveImport(fileTmpPath)
    }

    /** @type {PageObject} */
    let page
    if (is.fn(pageTmp)) {
      page = /** @type {PageObject} */ ({
        ...transmuted,
        View: /** @type {ModuleView} */ (pageTmp),
      })
    } else if (transmuted) {
      const { rendered: _rendered, ...trans } = transmuted
      /** @type {Record<string, unknown>} */
      const importedPage = is.error(pageTmp) || is.undefined(pageTmp) ? {} : pageTmp
      page = /** @type {PageObject} */ ({ ...trans, ...importedPage })
    } else {
      /** @type {Record<string, unknown>} */
      const importedPage = is.error(pageTmp) || is.undefined(pageTmp) ? {} : pageTmp
      page = /** @type {PageObject} */ ({ ...importedPage })
    }

    page.file = file.replace(/\\/gim, '/')

    // has to be initialized!
    page.state = {}

    if (!is.empty(transmuted.originalState)) {
      if (is.fn(transmuted.originalState)) {
        transmuted.originalState = transmuted.originalState(config)
      }

      if (is.objectNative(transmuted.originalState)) {
        page.state = transmuted.originalState
      }
    }

    const pageName = file
      .replace(pageDir, '')
      .replace(/index.[m]?js/gm, '')
      .replace(/.[m]?js/gm, '/')
      .replace(/\\/gim, '/')

    page.name = replaceSlashSlash(
      `${BLOG_DIR.replace(config.ROOT, String(config.WEB_ROOT))}/${pageName}`.replace(/\\/gim, '/'),
    )

    page.path = `${page.name}index.html`

    if (!page.View || !is.function(page.View.toString)) {
      // these names are local to this block; the block-scoped names
      // shadowing the outer pageDir/page would hit the temporal dead zone
      const relativePageDir = pageDir.replace(process.cwd(), '')
      // remove slashes
      const postName = page.name.replace(/\//g, '')
      const pagePath = `${relativePageDir}/${postName}.mjs`

      throw error(
        `
${pagePath}
needs to either
export default state => []
or
export const View = state => []
`,
        'E_INVALID_BLOGPOST',
      )
    }

    return page
  }
