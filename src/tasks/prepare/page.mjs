import path from 'path'

import error from '@magic/error'
import is from '@magic/types'
import fs from '@magic/fs'
import log from '@magic/log'
import transmute from '@magic/transmute'

export const preparePage = ({ WEB_ROOT, PAGES, state = {} }) => async file => {
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
    const viewString = `export const View = state => [${transmuted.rendered}]`

    const fileTmpPath = path.join(config.TMP_DIR, file.replace(config.DIR.PAGES, ''))

    const subDir = path.dirname(fileTmpPath)
    await fs.mkdirp(subDir)

    await fs.writeFile(fileTmpPath, viewString)
    pageTmp = await import(fileTmpPath)
  } else {
    try {
      pageTmp = await import(file)
    } catch (e) {
      if (e.code === 'ERR_UNKNOWN_FILE_EXTENSION') {
        log.warn('UNKNOWN_FILE_TYPE', `${file} is not an es6 component. Ignored.`)
        return
      }
    }
  }

  let page = {
    state: {},
  }

  if (is.fn(pageTmp)) {
    page = {
      ...transmuted,
      View: pageTmp,
    }
  } else if (transmuted) {
    const { rendered, ...t } = transmuted
    page = { ...t, ...pageTmp }
  } else {
    page = { ...pageTmp }
  }

  page.file = file

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

    page.state = {
      ...page.state,
      ...transmuted.originalState,
    }
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

    throw error(
      `
${pageDir}/${pageName}.mjs
needs to either
export default state => []
or
export const View = state => []
`,
      'E_INVALID_PAGE',
    )
  }

  return page
}
