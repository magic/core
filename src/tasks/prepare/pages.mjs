import is from '@magic/types'
import path from 'path'
import transmute from '@magic/transmute'
import { fs, mkdirp, rmrf } from '../../lib/index.mjs'

const tmpDir = path.join(process.cwd(), '.temp')

export const preparePages = async files => {
  const pagePromises = files.map(async file => {
    const ext = path.extname(file)

    const markdownExtensions = ['.md', '.markdown']
    const htmlExtensions = ['.html', '.htm']

    let transmuted = ''

    if (markdownExtensions.includes(ext)) {
      const content = await fs.readFile(file, 'utf8')
      transmuted = transmute.markdown(content)
      file = file
        .replace('.md', '.mjs')
        .replace('.markdown', '.mjs')
    } else if (htmlExtensions.includes(ext)) {
      const content = await fs.readFile(file, 'utf8')
      transmuted = transmute.html(content)
      file = file
        .replace('.html', '.mjs')
        .replace('.htm', '.mjs')
    }


    let pageTmp
    if (transmuted) {
      const viewString = `export const View = () => [${transmuted}]`
      const fileTmpPath = path.join(tmpDir, path.basename(file))
      await mkdirp(tmpDir)
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

    const pageName = file
      .replace(config.DIR.PAGES, '')
      .replace(/index.[m]?js/gm, '')
      .replace(/.[m]?js/gm, '/')

    if (config.WEB_ROOT !== '/') {
      let ROOT = config.WEB_ROOT
      if (ROOT && ROOT.endsWith('/')) {
        ROOT = ROOT.slice(0, -1)
      }
      page.name = `${ROOT}${pageName}`
    } else {
      page.name = pageName
    }

    page.path = path.join(config.DIR.PUBLIC, pageName)
    if (page.path.endsWith('/')) {
      if (page.name === '/404/') {
        // page path for 404 is /404.html, not /404/index.html
        page.path = `${page.path.slice(0, -1)}.html`
      } else {
        page.path = path.join(page.path, 'index.html')
      }
    }

    if (!page.View || !is.function(page.View.toString)) {
      const page = `${config.DIR.PAGES.replace(process.cwd(), '')}/${page.name.replace(/\//g, '')}.mjs`
      throw new Error(`
${page}
needs to either
export default () => []
or
export const View = () => []
`)
    }

    return page
  })

  const pages = await Promise.all(pagePromises)

  const has404 = pages.some(p => p.name === '/404/')

  if (!has404) {
    const page404 = {
      name: `${config.WEB_ROOT}404/`,
      path: path.join(config.DIR.PUBLIC, '404.html'),
      View: () => div('404 - not found'),
    }
    pages.push(page404)
  }

  const tmpExists = await fs.exists(tmpDir)
  if (tmpExists) {
    await rmrf(tmpDir)
  }

  return pages
}

export default preparePages
