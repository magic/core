import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'

import { getBlog, getPages } from '../../lib/index.mjs'

import { prepareBlog } from './blog.mjs'
import { prepareThemes } from './themes.mjs'
import { prepareGlobals } from './globals/index.mjs'
import { prepareJs } from './js.mjs'
import { prepareMetaFiles } from './meta.mjs'
import { prepareModules } from './modules.mjs'
import { preparePages } from './pages.mjs'
// import { prepareServiceWorker } from './service-worker.mjs'
import { prepareApi } from './api.mjs'

export const prepare = async (app, config) => {
  const defaultApp = {
    state: {},
    actions: {},
    effects: {},
    helpers: {},
    cookies: {},
    subscriptions: [],
    lib: {},
    init: [],
    server: {},
  }

  app = { ...defaultApp, ...app }

  if (is.fn(app.build)) {
    app = await app.build({ app, config })
  }

  let { modules, libs } = await prepareGlobals(app, config)

  app.files = await getPages()

  const moduleNames = Object.keys(modules)

  // collect the pages, create their states

  app.pages = await preparePages(app, moduleNames)

  if (config.BLOG_DIR) {
    app.blog = await getBlog(app.files)

    const { posts, index } = await prepareBlog(app, moduleNames)

    app.state.blog = index

    app.pages = [...app.pages, ...posts]
  }

  // collect all page states, actions, effects, helpers and subscriptions
  app.pages.forEach(page => {
    if (!is.empty(page.state)) {
      app.state.pages = app.state.pages || {}

      // filter page.state that is equal to already existing global state
      const tmpPageState = Object.entries(page.state).filter(([k, v]) => app.state[k] !== v)

      app.state.pages[page.name] = Object.fromEntries(tmpPageState)
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

    if (!is.empty(page.cookies)) {
      app.cookies = deep.merge(app.cookies, page.cookies)
    }

    if (!is.empty(page.init)) {
      app.init = deep.merge(app.init, page.init)
    }
  })

  // collect all static files,
  // write their buffers into app.static

  app.static = await prepareMetaFiles(app)

  let staticExists = false
  try {
    await fs.stat(config.DIR.STATIC)
    staticExists = true
  } catch (e) {
    // it's fine if the static dir does not exist,
    // but all other errors will throw.
    if (e.code !== 'ENOENT') {
      throw error(e)
    }
  }

  if (staticExists) {
    const staticFiles = await fs.getFiles(config.DIR.STATIC)
    if (!is.empty(staticFiles)) {
      const staticPromises = staticFiles.map(async f => {
        const name = f.replace(config.DIR.STATIC, '')
        // TODO: use streams here
        app.static[name] = await fs.readFile(f)
      })

      await Promise.all(staticPromises)
    }
  }

  libs.forEach(lib => {
    app.lib[lib.key] = lib.path
  })

  app.style = await prepareThemes({ app, modules })

  prepareModules(app, modules)

  app.modules = modules

  // create client magic.js file
  app.client = await prepareJs(app)

  // extract lambdas and prepare them
  app.lambdas = await prepareApi(app)

  // app.serviceWorker = await prepareServiceWorker(app, config)

  const tmpExists = await fs.exists(config.TMP_DIR)
  if (tmpExists && !config.KEEP_CLIENT) {
    await fs.rmrf(config.TMP_DIR)
  }

  return app
}

export default prepare
