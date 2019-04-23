const is = require('@magic/types')
const path = require('path')
const deep = require('@magic/deep')

const { isUpperCase, getDependencies } = require('../../lib')

const preparePages = files => {
  const pages = files.map(file => {
    let page = require(file)
    if (is.function(page)) {
      page = {
        ...page,
        View: page,
      }
    }

    page.file = file
    const pageName = file
      .replace(config.DIR.PAGES, '')
      .replace(/index.js/gm, '')
      .replace('.js', '/')

    if (config.ENV === 'production' && config.WEB_ROOT && config.WEB_ROOT !== '/') {
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
      throw new Error(`
${config.DIR.PAGES.replace(process.cwd(), '')}/${page.name.replace(/\//g, '')}.js
does not export a view function or page.View key.`)
    }

    page.dependencies = getDependencies(page.View, global.keys)

    const { THEME_VARS = {} } = config

    if (is.fn(page.style)) {
      page.style = page.style(THEME_VARS)
    }

    page.dependencyStyles = {}

    // merge dependency styles and subdependencies into page dependencies
    page.dependencies.forEach(dep => {
      Object.entries(dep).forEach(([k, c]) => {
        // console.log(c)
        if (c.style) {
          if (is.fn(c.style)) {
            c.style = c.style(THEME_VARS)
          }
          page.dependencyStyles = deep.merge(c.style, page.dependencyStyles)
        }

        const views = Object.entries(c)
          .filter(([k]) => isUpperCase(k))
          .map(([_, v]) => v.toString())

        views.forEach(view => {
          page.dependencies = deep.merge(getDependencies(view, global.keys), page.dependencies)
        })
      })
    })

    return page
  })

  const has404 = pages.some(p => p.name === '/404/')

  if (!has404) {
    const page404 = {
      name: '/404/',
      path: path.join(config.DIR.PUBLIC, '404.html'),
      View: () => div('404 - not found'),
    }
    page404.dependencies = getDependencies(page404.View, global.keys)
    pages.push(page404)
  }

  return pages
}
module.exports = preparePages
