import is from '@magic/types'
import path from 'path'
import transmute from '@magic/transmute'
import { fs } from '../../lib/index.mjs'

export const preparePage = ({ WEB_ROOT, PAGES }) => async file => {
  const ext = path.extname(file)

  const markdownExtensions = ['.md', '.markdown']
  const htmlExtensions = ['.html', '.htm']

  let transmuted = ''

  if (markdownExtensions.includes(ext)) {
    const content = await fs.readFile(file, 'utf8')
    transmuted = transmute.markdown(content)
    file = file.replace('.md', '.mjs').replace('.markdown', '.mjs')
  } else if (htmlExtensions.includes(ext)) {
    const content = await fs.readFile(file, 'utf8')
    transmuted = transmute.html(content)
    file = file.replace('.html', '.mjs').replace('.htm', '.mjs')
  }

  let pageTmp
  if (transmuted) {
    const viewString = `export const View = () => [${transmuted.rendered}]`
    const fileTmpPath = path.join(config.TMP_DIR, path.basename(file))
    await fs.mkdirp(config.TMP_DIR)
    await fs.writeFile(fileTmpPath, viewString)
    pageTmp = await import(fileTmpPath)
  } else {
    pageTmp = await import(file)
  }

  let page
  if (is.fn(pageTmp)) {
    page = {
      ...page,
      View: page,
    }
  } else {
    page = { ...pageTmp }
  }

  page.file = file

  if (!is.empty(transmuted.state)) {
    page.state = transmuted.state
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

    throw new Error(`
${page}
needs to either
export default () => []
or
export const View = () => []
`)
  }

  return page
}
