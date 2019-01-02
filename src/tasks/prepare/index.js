const fs = require('fs')
const path = require('path')
const is = require('@magic/types')
const deep = require('@magic/deep')
let components = require('../../modules')
const { getFiles, getDependencies, isUpperCase } = require('../../lib')
const prepareLib = require('./prepareLib')
const preparePages = require('./preparePages')

global.keys = new Set()

let exists = false
const prepare = async app => {
  global.config = require('../../config')

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

  const files = await getFiles(config.DIR.PAGES)

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

  app.pages = preparePages(files).map(page => {
    if (!is.empty(page.state)) {
      app.state.pages[page.name] = page.state
    }
    if (!is.empty(page.actions)) {
      app.actions.pages[page.name] = page.actions
    }

    const dependencies = getDependencies(page.Body.toString())
    Object.entries(dependencies).forEach(([name, component]) => {
      if (is.object(component) && isUpperCase(name)) {
        if (component.global) {
          Object.entries(component.global.state)
            .filter(s => s[1] === true)
            .forEach(([key, val]) => {
              app.state[key] = component.state[key]
            })

          Object.entries(component.global.actions)
            .filter(s => s[1] === true)
            .forEach(([key, val]) => {
              app.actions[key] = component.actions[key]
            })
        }
      }
    })

    app.dependencies = deep.merge(app.dependencies, page.dependencies)
    app.style = deep.merge(app.style, page.style)
    return page
  })

  app.static = {}
  const staticFiles = await getFiles(config.DIR.STATIC)
  await Promise.all(
    staticFiles.map(async f => {
      const name = f.replace(config.DIR.STATIC, '')
      app.static[name] = fs.readFileSync(f)
    }),
  )

  app.lib = {
    str: prepareLib(app),
  }

  return app
}

module.exports = prepare
