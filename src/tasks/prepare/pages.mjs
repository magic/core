import is from '@magic/types'
import path from 'path'

export const preparePages = async files => {
  const pagePromises = files.map(async file => {
    const pageTmp = await import(file)
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

  return pages
}

export default preparePages
