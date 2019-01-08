const path = require('path')
const deep = require('@magic/deep')

const { isUpperCase, getDependencies, requireNow } = require('../../lib')

const { mapPageObject } = require('./lib/')

const preparePages = files => {
  const pages = files.map(file => {
    const page = requireNow(file)
    page.file = file
    page.name = file
      .replace(config.DIR.PAGES, '')
      .replace(/index.js/gm, '')
      .replace('.js', '/')

    page.path = path.join(config.DIR.PUBLIC, page.name)
    if (page.path.endsWith('/')) {
      page.path = path.join(page.path, 'index.html')
    }

    page.dependencies = getDependencies(page.Body.toString())

    Object.entries(page.dependencies).forEach(([k, c]) => {
      if (c.state) {
        Object.entries(c.state).forEach(mapPageObject(page, 'state', c))
      }

      if (c.actions) {
        Object.entries(c.actions).forEach(mapPageObject(page, 'actions', c))
      }

      if (c.style) {
        page.style = deep.merge(c.style, page.style)
      }

      const views = Object.entries(c)
        .filter(([k]) => isUpperCase(k))
        .map(([_, v]) => v.toString())

      views.forEach(view => {
        page.dependencies = deep.merge(getDependencies(view), page.dependencies)
      })
    })

    return page
  })

  const has404 = pages.some(p => p.name === '/404/')
  if (!has404) {
    const page404 = {
      name: '/404/',
      path: path.join(config.DIR.PUBLIC, '404', 'index.html'),
      Body: (state, actions) => div('404 - not found'),
    }
    page404.dependencies = getDependencies(page404.Body.toString())
    pages.push(page404)
  }

  return pages
}
module.exports = preparePages
