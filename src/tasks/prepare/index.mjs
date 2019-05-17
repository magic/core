import is from '@magic/types'

import { getFiles, getPages, isUpperCase, fs, createFileHash } from '../../lib/index.mjs'

import { prepareGlobals } from './globals.mjs'
import prepareClient from './client.mjs'
import preparePages from './pages.mjs'
import { prepareStyle } from './style.mjs'
import prepareMetaFiles from './meta.mjs'

export const prepare = async app => {
  const { modules, lib } = await prepareGlobals(app)

  const files = await getPages()

  app.files = files

  app.state = app.state || {}
  app.actions = app.actions || {}
  app.effects = app.effects || {}
  app.subscriptions = app.subscriptions || {}

  // collect the pages, create their states
  app.pages = await preparePages(files)

  app.pages.map(page => {
    if (!is.empty(page.state)) {
      if (!app.state.pages) {
        app.state.pages = {}
      }
      app.state.pages[page.name] = page.state
    }

    const actionTypes = ['actions', 'effects', 'subscriptions']
    actionTypes
      .filter(type => !page[type])
      .forEach(type => {
        app[type].pages = app[type].pages || {}
        app[type].pages[page.name] = page[type]
      })

    return page
  })

  // collect all static files,
  // write their buffers into app.static
  app.static = await prepareMetaFiles(app)
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
          if (glob.state && glob.state[key] === true) {
            app.state[key] = val
          } else {
            app.state[lowerName] = app.state[lowerName] || {}
            app.state[lowerName][key] = val
          }
        })
      }

      const actionTypes = ['actions', 'effects', 'subscriptions']
      actionTypes
        .filter(type => !is.empty(component[type]))
        .forEach(type => {
          Object.entries(component[type]).forEach(([key, val]) => {
            if (glob[type] && glob[type][key] === true) {
              app[type][key] = val
            } else {
              app[type][lowerName] = app[type][lowerName] || {}
              app[type][lowerName][key] = val
            }
          })
        })
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

export default prepare
