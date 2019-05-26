import is from '@magic/types'
import deep from '@magic/deep'

import { getFiles, getPages, isUpperCase, fs, createFileHash } from '../../lib/index.mjs'

import { prepareGlobals } from './globals.mjs'
import prepareJs from './client.mjs'
import preparePages from './pages.mjs'
import { prepareCss } from './css.mjs'
import prepareMetaFiles from './meta.mjs'

export const prepare = async app => {
  const { modules, libs } = await prepareGlobals(app)

  const files = await getPages()

  app.files = files

  app.state = app.state || {}
  app.actions = app.actions || {}
  app.effects = app.effects || {}
  app.helpers = app.helpers || {}
  app.subscriptions = app.subscriptions || []

  // collect the pages, create their states
  app.pages = await preparePages(files)

  app.pages.map(page => {
    if (!is.empty(page.state)) {
      if (!app.state.pages) {
        app.state.pages = {}
      }
      app.state.pages[page.name] = page.state
    }

    const actionTypes = ['actions', 'effects']
    actionTypes
      // do nothing if page has no actions or effects (type)
      .filter(type => !is.empty(page[type]))
      .forEach(type => {
        app[type].pages = app[type].pages || {}
        app[type].pages[page.name] = page[type]
      })

    if (!is.empty(page.subscriptions)) {
      page.subscriptions.forEach(sub => {
        app.subscriptions.push(sub)
      })
    }

    if (!is.empty(page.helpers)) {
      app.helpers = deep.merge(app.helpers, page.helpers)
    }

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

  app.lib = app.lib || {}
  libs.forEach(lib => {
    app.lib[lib.key] = lib.path
  })

  app.style = await prepareCss({ app, modules })

  // merge component states into app.state[componentName].
  // this makes all identical components share their state.
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

      const actionTypes = ['actions', 'effects']
      actionTypes
        // if component has no actions or effects do nothing
        .filter(type => !is.empty(component[type]))
        .forEach(type => {
          Object.entries(component[type]).forEach(([key, val]) => {
            if (glob[type] && glob[type][key] === true) {
              app[type][key] = val
            } else {
              if (Object.keys(val).includes(key)) {
                app[type][lowerName] = val[key]
              } else {
                app[type][lowerName] = val
              }
            }
          })
        })

      if (!is.empty(component.helpers)) {
        app.helpers = deep.merge(app.helpers, component.helpers)
      }

      if (!is.empty(component.subscriptions)) {
        component.subscriptions.forEach(sub => {
          app.subscriptions.push(sub)
        })
      }
    })

  app.modules = modules

  // create client magic.js file
  app.client = await prepareJs(app)

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
