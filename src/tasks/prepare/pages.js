const is = require('@magic/types')
const path = require('path')
const deep = require('@magic/deep')

const { isUpperCase, getDependencies } = require('../../lib')

const preparePages = files => {
  const pages = files.map(file => {
    const page = require(file)
    page.file = file
    page.name = file
      .replace(config.DIR.PAGES, '')
      .replace(/index.js/gm, '')
      .replace('.js', '/')

    page.path = path.join(config.DIR.PUBLIC, page.name)
    if (page.path.endsWith('/')) {
      page.path = path.join(page.path, 'index.html')
    }

    let view = false
    if (typeof page === 'function') {
      view = page
      page.View = view
    } else if (typeof page.View === 'function') {
      view = page.View
    }

    if (!view || typeof view.toString !== 'function') {
      throw new Error(`
${config.DIR.PAGES.replace(process.cwd(), '')}/${page.name.replace(/\//g, '')}.js
does not export a view function or page.View key.`)
    }

    page.dependencies = getDependencies(view, global.keys)

    const { THEME_VARS = {} } = config

    if (is.fn(page.style)) {
      page.style = page.style(THEME_VARS)
    }

    // merge dependency styles and subdependencies into page dependencies
    Object.entries(page.dependencies).forEach(([k, c]) => {
      if (c.style) {
        if (is.fn(c.style)) {
          c.style = c.style(THEME_VARS)
        }
        page.style = deep.merge(c.style, page.style)
      }

      const views = Object.entries(c)
        .filter(([k]) => isUpperCase(k))
        .map(([_, v]) => v.toString())

      views.forEach(view => {
        page.dependencies = deep.merge(getDependencies(view, global.keys), page.dependencies)
      })
    })

    return page
  })

  const has404 = pages.some(p => p.name === '/404/')

  if (!has404) {
    const page404 = {
      name: '/404/',
      path: path.join(config.DIR.PUBLIC, '404', 'index.html'),
      View: () => div('404 - not found'),
    }
    page404.dependencies = getDependencies(page404.View, global.keys)
    pages.push(page404)
  }

  return pages
}
module.exports = preparePages
