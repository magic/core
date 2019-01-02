const path = require('path')
const deep = require('@magic/deep')
const { getDependencies, requireNow } = require('../../lib')

const preparePages = files =>
  files.map(file => {
    const page = requireNow(file)
    page.file = file
    page.name = file.replace(config.DIR.PAGES, '').replace(/index?.js/gm, '')
    page.path = path.join(config.DIR.PUBLIC, page.name)
    if (!page.path.endsWith('index.js') && page.path.endsWith('/')) {
      page.path = path.join(page.path, 'index.html')
    }

    page.dependencies = getDependencies(page.Body.toString())

    Object.entries(page.dependencies).forEach(([k, c]) => {
      if (c.state) {
        page.state = deep.merge(c.state, page.state)
      }
      if (c.actions) {
        page.actions = deep.merge(c.actions, page.actions)
      }

      if (c.style) {
        page.style = deep.merge(c.style, page.style)
      }
    })

    return page
  })

module.exports = preparePages
