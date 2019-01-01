const fs = require('fs')
const path = require('path')
const is = require('@magic/types')
const deep = require('@magic/deep')
let components = require('../../modules')
const { getFiles, getDependencies } = require('../../lib')
const prepareLib = require('./prepareLib')

global.keys = new Set()

const globalize = (key, value) => {
  if (is.array(key)) {
    keys.add(key[0])
    global[key[0]] = key[1]
    return
  }

  keys.add(key)
  global[key] = value
}

let exists = false
const prepare = ({ config }) => {
  global.config = config

  const maybeAssetFile = path.join(config.DIR.ASSETS, 'index.js')
  if (exists || fs.existsSync(maybeAssetFile)) {
    exists = true
    const assets = require(maybeAssetFile)
    components = deep.merge(components, assets)
  }

  Object.entries(components).forEach(globalize)

  const files = getFiles(config.DIR.PAGES)

  const pages = files.map(file => {
    const page = require(file)
    page.file = file
    page.name = file.replace(config.DIR.PAGES, '').replace(/index?.js/gm, '')
    page.path = path.join(config.DIR.TMP, page.name)
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

  global.app = components.app

  app.state = deep.merge(app.state, { pages: {} })
  app.actions = deep.merge(app.actions, { pages: {} })
  app.dependencies = getDependencies(app.Body.toString())

  Object.entries(app.dependencies).forEach(([k, dep]) => {
    if (dep.state) {
      app.state = deep.merge(dep.state, app.state)
    }
    if (dep.actions) {
      app.actions = deep.merge(dep.actions, app.actions)
    }
    if (dep.style) {
      app.style = deep.merge(dep.style, app.style)
    }
  })

  pages.forEach(page => {
    app.state.pages[page.name] = page.state
    app.actions.pages[page.name] = page.actions

    const dependencies = getDependencies(page.Body.toString())
    pages.forEach(page => {
      app.dependencies = deep.merge(app.dependencies, page.dependencies)
    })

    app.style = deep.merge(app.style, page.style)
  })

  app.files = files
  app.pages = pages

  app.static = {}
  getFiles(config.DIR.STATIC).map(f => {
    const name = f.replace(config.DIR.STATIC, '')
    app.static[name] = fs.readFileSync(f)
  })

  app.lib = {
    str: prepareLib(),
  }
}

module.exports = prepare
