const is = require('@magic/types')
const { getFiles, getPages, isUpperCase, fs } = require('../../lib')

const prepareGlobals = require('./globals')
const prepareClient = require('./client')
const preparePages = require('./pages')
const prepareStyle = require('./style')

const { isGlobal } = require('./lib')

const prepare = async app => {
  const { modules, lib } = await prepareGlobals(app)

  const files = await getPages()

  app.files = files

  app.state = app.state || {}
  app.actions = app.actions || {}

  // collect the pages, create their states
  app.pages = await preparePages(files)

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

  app.lib = lib

  app.style = await prepareStyle({ app, modules })

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

  app.modules = modules

  // create client magic.js file
  app.client = {
    str: await prepareClient(app),
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
