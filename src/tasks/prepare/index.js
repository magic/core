const path = require('path')

const is = require('@magic/types')
const deep = require('@magic/deep')
const { getFiles, getPages, isUpperCase, fs } = require('../../lib')
const prepareGlobals = require('./globals')
const prepareClient = require('./client')
const preparePages = require('./pages')
const prepareStyle = require('./style')
const prepareDependencies = require('./dependencies')

const { isGlobal } = require('./lib')

const prepare = async app => {
  await prepareGlobals()

  const files = await getPages()

  app.files = files

  // using merge here to make sure app.state and app.actions are being set if undefined
  app.state = deep.merge({}, app.state)
  app.actions = deep.merge({}, app.actions)

  // collect the pages, create their states
  app.pages = preparePages(files)

  app.pages.map(page => {
    if (!is.empty(page.state)) {
      if (!app.state.pages) {
        app.state.pages = {}
      }
      app.state.pages[page.name] = page.state
    }
    if (!is.empty(page.actions)) {
      if (!app.actions.pages) {
        app.actions.pages = {}
      }
      app.actions.pages[page.name] = page.actions
    }

    return page
  })

  // collect all static files,
  // write their buffers into app.static
  app.static = {}
  if (await fs.exists(config.DIR.STATIC)) {
    const staticFiles = await getFiles(config.DIR.STATIC)
    if (staticFiles) {
      await Promise.all(
        staticFiles.map(async f => {
          const name = f.replace(config.DIR.STATIC, '')
          // TODO: use streams here
          app.static[name] = await fs.readFile(f)
        }),
      )
    }
  }

  const { lib, modules } = await prepareDependencies(app)

  app.dependencies = modules
  app.lib = lib

  Object.entries(modules).forEach(([key, val]) => {
    global.keys.add(key)
    global[key] = val
  })

  app.style = await prepareStyle(app)

  // merge component states and actions into app.state[componentName].
  // this makes all identical components share their state and actions.
  Object.entries(modules)
    .filter(([name]) => isUpperCase(name))
    .forEach(([name, component]) => {
      const lowerName = name.toLowerCase()

      const glob = component.global || {}

      if (!is.empty(component.state)) {
        Object.entries(component.state).forEach(([key, val]) => {
          if (isGlobal(glob.state, key)) {
            app.state[key] = val
          } else {
            app.state[lowerName] = app.state[lowerName] || {}
            app.state[lowerName][key] = val
          }
        })
      }

      if (!is.empty(component.actions)) {
        Object.entries(component.actions).forEach(([key, val]) => {
          if (isGlobal(glob.actions, key)) {
            app.actions[key] = val
          } else {
            app.actions[lowerName] = app.actions[lowerName] || {}
            app.actions[lowerName][key] = val
          }
        })
      }
    })

  // create client magic.js file
  app.client = {
    str: prepareClient(app),
  }

  // extract lambdas and prepare them
  app.lambdas = {}
  Object.entries(modules)
    .filter(([_, dep]) => dep.server)
    .forEach(([name, dep]) => {
      app.lambdas[name.toLowerCase()] = dep.server
    })

  return app
}

module.exports = prepare
