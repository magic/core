import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import transmute from '@magic/transmute'

export const prepareBlogPost = ({ WEB_ROOT, PAGES, state = {} }) => async file => {
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

    const fileTmpPath = path.join(config.TMP_DIR, path.basename(file))
    await fs.mkdirp(config.TMP_DIR)
    await fs.writeFile(fileTmpPath, viewString)
    pageTmp = await import(fileTmpPath)
  } else {
    pageTmp = await import(file)

    let children = []
    if (is.fn(pageTmp)) {
      children = page.toString().split('=>')[1]
    } else if (is.fn(pageTmp.View)) {
      children = page.View.toString().split('=>')[1]
    }

    viewString = `export const View = state => BlogPost(state, ${children})`

    const fileTmpPath = path.join(config.TMP_DIR, path.basename(file))
    await fs.mkdirp(config.TMP_DIR)
    await fs.writeFile(fileTmpPath, viewString)
    pageTmp = await import(fileTmpPath)
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

  page.file = file

  // has to be initialized!
  page.state = {}

  if (!is.empty(transmuted.originalState)) {
    if (is.fn(transmuted.originalState)) {
      transmuted.originalState = transmuted.originalState(config)
    }

    page.state = transmuted.originalState
  }

  const pageName = file
    .replace(PAGES, '')
    .replace(/index.[m]?js/gm, '')
    .replace(/.[m]?js/gm, '/')

  if (WEB_ROOT !== '/') {
    page.name = `${WEB_ROOT}${pageName}`
  } else {
    page.name = pageName
  }

  page.path = page.name

  if (page.path.endsWith('/')) {
    if (page.name === '/404/') {
      // page path for 404 is /404.html, not /404/index.html
      page.path = `${page.path.slice(0, -1)}.html`
    } else {
      page.path = path.join(page.path, 'index.html')
    }
  }

  if (!page.View || !is.function(page.View.toString)) {
    const pageDir = PAGES.replace(process.cwd(), '')
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
