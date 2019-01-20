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

  app.state = deep.merge(app.state, { pages: {} })
  app.actions = deep.merge(app.actions, { pages: {} })
  app.dependencies = getDependencies(app.Body.toString())

  if (config.ENV === 'development') {
    app.dependencies = deep.merge(app.dependencies, adminModules)
    app.state.config = global.config
  }

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

  app.pages = preparePages(files).map(page => {
    if (!is.empty(page.state)) {
      app.state.pages[page.name] = page.state
    }
    if (!is.empty(page.actions)) {
      app.actions.pages[page.name] = page.actions
    }

    const dependencies = getDependencies(page.View.toString())
    Object.entries(dependencies).forEach(([name, component]) => {
      if (is.object(component) && isUpperCase(name)) {
        if (component.global) {
          if (component.global.state) {
            Object.entries(component.global.state)
              .filter(s => s[1] === true)
              .forEach(([key, val]) => {
                app.state[key] = component.state[key]
              })
          }

          if (component.global.actions) {
            Object.entries(component.global.actions)
              .filter(s => s[1] === true)
              .forEach(([key, val]) => {
                app.actions[key] = component.actions[key]
              })
          }
        }
      }
    })

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

  app.lib = {
    str: prepareLib(app),
  }

  return app
}

module.exports = prepare
