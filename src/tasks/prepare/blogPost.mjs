import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import transmute from '@magic/transmute'

import { replaceSlashSlash, saveImport } from '../../lib/index.mjs'

export const prepareBlogPost =
  ({ pageDir, state = {}, config }) =>
  async file => {
    const { TMP_DIR } = config

    const ext = path.extname(file)

    const markdownExtensions = ['.md', '.markdown']
    const htmlExtensions = ['.html', '.htm']

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

    let pageTmp
    if (!is.empty(transmuted)) {
      const viewString = `export const View = state => BlogPost(state, [${transmuted.rendered}])`

      const fileTmpPath = path.join(TMP_DIR, path.basename(file))
      await fs.mkdirp(TMP_DIR)
      await fs.writeFile(fileTmpPath, viewString)
      pageTmp = await saveImport(fileTmpPath)
    } else {
      pageTmp = await saveImport(file)

      let children = []
      if (is.fn(pageTmp)) {
        children = pageTmp.toString().split('=>')[1]
      } else if (is.fn(pageTmp.View)) {
        children = pageTmp.View.toString().split('=>')[1]
      }

      viewString = `export const View = state => BlogPost(state, ${children})`

      const fileTmpPath = path.join(TMP_DIR, path.basename(file))
      await fs.mkdirp(TMP_DIR)
      await fs.writeFile(fileTmpPath, viewString)
      pageTmp = await saveImport(fileTmpPath)
    }

    let page
    if (is.fn(pageTmp)) {
      page = {
        ...transmuted,
        View: pageTmp,
      }
    } else if (transmuted) {
      const { rendered, ...trans } = transmuted
      page = { ...trans, ...pageTmp }
    } else {
      page = { ...pageTmp }
    }

    page.file = file.replace(/\\/gim, '/')

    // has to be initialized!
    page.state = {}

    if (!is.empty(transmuted.originalState)) {
      if (is.fn(transmuted.originalState)) {
        transmuted.originalState = transmuted.originalState(config)
      }

      page.state = transmuted.originalState
    }

    const pageName = file
      .replace(pageDir, '')
      .replace(/index.[m]?js/gm, '')
      .replace(/.[m]?js/gm, '/')
      .replace(/\\/gim, '/')

    page.name = replaceSlashSlash(
      `${config.BLOG_DIR.replace(config.ROOT, config.WEB_ROOT)}/${pageName}`.replace(/\\/gim, '/'),
    )

    page.path = `${page.name}index.html`

    if (!page.View || !is.function(page.View.toString)) {
      const pageDir = pageDir.replace(process.cwd(), '')
      // remove slashes
      const pageName = page.name.replace(/\//g, '')
      const page = `${pageDir}/${pageName}.mjs`

      throw error(
        `
${page}
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
