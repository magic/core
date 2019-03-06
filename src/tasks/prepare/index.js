const path = require('path')
const is = require('@magic/types')
const deep = require('@magic/deep')
let modules = require('../../modules')
const adminModules = require('../../modules/admin/modules')
const { getFiles, getPages, getDependencies, isUpperCase, fs } = require('../../lib')
const prepareLib = require('./prepareLib')
const preparePages = require('./preparePages')

global.keys = new Set()

let exists = false

const prepare = async app => {
  const maybeAssetFile = path.join(config.DIR.ASSETS, 'index.js')
  if (exists || (await fs.exists(maybeAssetFile))) {
    exists = true
    const assets = require(maybeAssetFile)
    modules = deep.merge(modules, assets)
  }

  Object.entries(modules).forEach(([key, value]) => {
    keys.add(key)
    global[key] = value
  })

  const files = await getPages()

  app.files = files

  app.dependencies = getDependencies(app.Body.toString())

  if (config.ENV === 'development') {
    app.dependencies = deep.merge(app.dependencies, adminModules)
    app.state.config = global.config
  }

  app.state.pages = {}
  app.actions.pages = {}

  app.pages = preparePages(files).map(page => {
    if (!is.empty(page.state)) {
      app.state.pages[page.name] = page.state
    }
    if (!is.empty(page.actions)) {
      app.actions.pages[page.name] = page.actions
    }

    app.dependencies = deep.merge(page.dependencies, app.dependencies)
    app.style = deep.merge(page.style, app.style)

    return page
  })

  app.static = {}
  if (await fs.exists(config.DIR.STATIC)) {
    const staticFiles = await getFiles(config.DIR.STATIC)
    if (staticFiles) {
      await Promise.all(
        staticFiles.map(async f => {
          const name = f.replace(config.DIR.STATIC, '')
          app.static[name] = await fs.readFile(f)
        }),
      )
    }
  }

  Object.entries(app.dependencies)
    .filter(([name]) => isUpperCase(name))
    .forEach(([name, component]) => {
      const lowerName = name.toLowerCase()
      const { state = {}, actions = {} } = component.global || {}

      if (component.state) {
        Object.entries(component.state).forEach(([key, val]) => {
          if (state[key] === true) {
            app.state[key] = val
          } else {
            app.state[lowerName] = app.state[lowerName] || {}
            app.state[lowerName][key] = val
          }
        })
      }

      if (component.actions) {
        Object.entries(component.actions).forEach(([key, val]) => {
          if (actions[key] === true) {
            app.actions[key] = val
          } else {
            app.actions[lowerName] = app.actions[lowerName] || {}
            app.actions[lowerName][key] = val
          }
        })
      }
    })

  app.lib = {
    str: prepareLib(app),
  }

  return app
}

module.exports = prepare
