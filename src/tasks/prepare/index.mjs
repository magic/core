import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'

import { getBlog, getPages, replaceSlashSlash } from '../../lib/index.mjs'

import { prepareBlog } from './blog.mjs'
import { prepareThemes } from './themes.mjs'
import { prepareGlobals } from './globals/index.mjs'
import { prepareJs } from './js.mjs'
import { prepareMetaFiles } from './meta.mjs'
import { prepareModules } from './modules.mjs'
import { preparePages } from './pages.mjs'
// import { prepareServiceWorker } from './service-worker.mjs'
import { prepareApi } from './api.mjs'
import { prepareStateLinks } from './stateLinks.mjs'

import { defaultApp } from '../../defaultApp.mjs'

export const prepare = async (app, config) => {
  app = { ...defaultApp, ...app }

  if (is.fn(app.build)) {
    app = await app.build({ app, config })
  }

  let { modules, libs } = await prepareGlobals(app, config)

  libs.forEach(({ key, lib }) => {
    app.lib[key] = lib
  })

  app.modules = modules

  // make all links WEB_ROOTED
  // mutates app.state
  app.state = prepareStateLinks(app, config)

  app.files = await getPages({ dir: config.DIR.PAGES, root: config.ROOT })

  // collect the pages, create their states
  app.pages = await preparePages(app, config)

  if (config.BLOG_DIR) {
    app.blog = await getBlog(config)

    const { posts, index } = await prepareBlog(app, config)

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

  app.static = await prepareMetaFiles(app, config)

  try {
    let staticDirs = config.DIR.STATIC
    if (!is.array(staticDirs)) {
      staticDirs = [staticDirs]
    }

    await Promise.all(
      staticDirs.map(async dir => {
        const staticFiles = await fs.getFiles(dir)

        if (!is.empty(staticFiles)) {
          const staticPromises = staticFiles.map(async f => {
            const name = replaceSlashSlash(`/${f.replace(dir, '')}`)
            // TODO: use streams here
            app.static[name] = await fs.readFile(f)
          })

          await Promise.all(staticPromises)
        }
      }),
    )
  } catch (e) {
    // it's fine if the static dir does not exist,
    // but all other errors will throw.
    if (e.code !== 'ENOENT') {
      throw error(e)
    }
  }

  app.style = await prepareThemes(app, config)

  // mutates app
  // init, cookies, actions, effects, state, helpers, subscriptions
  prepareModules(app, config)

  // create client magic.js file
  app.client = await prepareJs(app, config)

  // extract lambdas and prepare them
  app.lambdas = await prepareApi(app, config)

  // app.serviceWorker = await prepareServiceWorker(app, config)

  const tmpExists = await fs.exists(config.TMP_DIR)
  if (tmpExists && !config.KEEP_CLIENT) {
    await fs.rmrf(config.TMP_DIR)
  }

  return app
}

export default prepare
