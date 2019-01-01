const fs = require('fs')
const path = require('path')
const is = require('@magic/types')
const deep = require('@magic/deep')
let components = require('../../modules')
const { getFiles, getDependencies } = require('../../lib')
const prepareLib = require('./prepareLib')
const preparePages = require('./preparePages')

global.keys = new Set()

let exists = false
const prepare = ({ config }) => {
  global.config = config

  const maybeAssetFile = path.join(config.DIR.ASSETS, 'index.js')
  if (exists || fs.existsSync(maybeAssetFile)) {
    exists = true
    const assets = require(maybeAssetFile)
    components = deep.merge(components, assets)
  }

  Object.entries(components).forEach(([key, value]) => {
    keys.add(key)
    global[key] = value
  })

  const files = getFiles(config.DIR.PAGES)

  global.app = require('../../modules/app')

  app.files = files

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

  const pages = preparePages(files)
  pages.forEach(page => {
    app.state.pages[page.name] = page.state
    app.actions.pages[page.name] = page.actions

    const dependencies = getDependencies(page.Body.toString())
    pages.forEach(page => {
      app.dependencies = deep.merge(app.dependencies, page.dependencies)
    })

    app.style = deep.merge(app.style, page.style)
  })
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
