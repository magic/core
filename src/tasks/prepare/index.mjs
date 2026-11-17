import deep from '@magic/deep'
import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'
import is from '@magic/types'

import { defaultApp } from '../../defaultApp.mjs'
import { getBlog, getPages, replaceSlashSlash } from '../../lib/index.mjs'
// import { prepareServiceWorker } from './service-worker.mjs'
import { prepareApi } from './api.mjs'
import { prepareBlog } from './blog.mjs'
import { prepareDependencies } from './dependencies.mjs'
import { prepareGlobals } from './globals/index.mjs'
import { prepareJs } from './js.mjs'
import { prepareMetaFiles } from './meta.mjs'
import { prepareModules } from './modules.mjs'
import { preparePages } from './pages.mjs'
import { prepareStateLinks } from './stateLinks.mjs'
import { prepareThemes } from './themes.mjs'

/** @import { AppObject, Config, PageObject, NodeError, Subscription } from '../../types.mjs' */

/**
 * @param {AppObject} paramApp
 * @param {Config} config
 * @returns {Promise<AppObject>}
 */
export const prepare = async (paramApp, config) => {
  /** @type {AppObject} */
  let app = /** @type {AppObject} */ ({
    .../** @type {Record<string, unknown>} */ (defaultApp),
    ...paramApp,
  })

  if (is.fn(app.build)) {
    app = /** @type {AppObject} */ (
      await /** @type {(params: { app: AppObject, config: Config }) => Promise<unknown>} */ (
        /** @type {unknown} */ (app.build)
      )({ app, config })
    )
  }

  app.files = /** @type {string[]} */ (await getPages({ dir: config.DIR.PAGES, root: config.ROOT }))

  // collect the pages, create their states
  app.pages = /** @type {PageObject[]} */ (await preparePages(app, config))

  const { modules, libs } = await prepareGlobals(app, config)

  app.lib = app.lib ?? {}
  libs.forEach(({ key, lib }) => {
    ;/** @type {Record<string, unknown>} */ (app.lib)[key] = lib
  })

  app.modules = modules

  // make all links WEB_ROOTED
  // mutates app.state
  const state = prepareStateLinks(app, config)
  app.state = state

  if (config.BLOG_DIR) {
    app.blog = /** @type {string[]} */ (await getBlog(config))

    const { posts, index } = await prepareBlog(app, config)

    state.blog = index

    app.pages = [...app.pages, .../** @type {PageObject[]} */ (posts)]
  }

  // collect all page states, actions, effects, helpers and subscriptions
  ;/** @type {PageObject[]} */ (app.pages).forEach(page => {
    if (page.state && !is.empty(page.state)) {
      state.pages = state.pages || {}

      // filter page.state that is equal to already existing global state
      const tmpPageState = Object.entries(
        /** @type {Record<string, unknown>} */ (page.state),
      ).filter(([k, v]) => state[k] !== v)

      ;/** @type {Record<string, unknown>} */ (state.pages)[String(page.name)] =
        Object.fromEntries(tmpPageState)
    }

    const actionTypes = ['actions', 'effects']
    actionTypes
      // do nothing if page has no actions or effects (type)
      .filter(type => !is.empty(page[type]))
      .forEach(type => {
        const section = /** @type {{ pages?: Record<string, unknown> }} */ (app[type])
        section.pages = section.pages || {}
        section.pages[String(page.name)] = page[type]
      })

    if (page.subscriptions && !is.empty(page.subscriptions)) {
      ;/** @type {Subscription[]} */ (page.subscriptions).forEach(sub => {
        const subs = /** @type {Subscription[]} */ (app.subscriptions)
        subs.push(sub)
      })
    }

    if (!is.empty(page.helpers)) {
      log.warn(
        'E_HELPERS_DEPRECATED',
        `page: ${page.name}`,
        'using app.helpers is deprecated, use actions, effects or lib',
      )
      app.helpers = /** @type {Record<string, unknown>} */ (
        deep.merge(
          /** @type {Record<string, unknown>} */ (app.helpers),
          /** @type {Record<string, unknown>} */ (page.helpers),
        )
      )
    }

    if (!is.empty(page.cookies)) {
      app.cookies = /** @type {Record<string, unknown>} */ (
        deep.merge(
          /** @type {Record<string, unknown>} */ (app.cookies),
          /** @type {Record<string, unknown>} */ (page.cookies),
        )
      )
    }

    if (!is.empty(page.init)) {
      app.init = /** @type {unknown} */ (
        deep.merge(/** @type {unknown} */ (app.init), /** @type {unknown} */ (page.init))
      )
    }
  })

  // collect all static files,
  // write their buffers into app.static

  app.static = await prepareMetaFiles(app, config)

  try {
    const staticDirsRaw = config.DIR.STATIC
    /** @type {string[]} */
    const staticDirs = is.array(staticDirsRaw)
      ? /** @type {string[]} */ (staticDirsRaw)
      : [/** @type {string} */ (staticDirsRaw)]

    await Promise.all(
      staticDirs.map(async dir => {
        const staticFiles = await fs.getFiles(dir)

        if (!is.empty(staticFiles)) {
          const staticPromises = staticFiles.map(async f => {
            const name = replaceSlashSlash(`/${f.replace(dir, '')}`)

            // TODO: use streams here
            ;/** @type {Record<string, unknown>} */ (app.static)[name] = await fs.readFile(f)
          })

          await Promise.all(staticPromises)
        }
      }),
    )
  } catch (e) {
    // it's fine if the static dir does not exist,
    // but all other errors will throw.
    if (/** @type {NodeError} */ (e).code !== 'ENOENT') {
      throw error(/** @type {Error} */ (e))
    }
  }

  app.style = await prepareThemes(app, config)

  // mutates app
  // init, cookies, actions, effects, state, helpers, subscriptions
  prepareModules(app)

  // create client magic.js file
  app.client = await prepareJs(app, config)

  if (config.SPLIT) {
    app.dependencies = await prepareDependencies(app, config)
  }

  // extract lambdas and prepare them
  app.lambdas = await prepareApi(app, config)

  // app.serviceWorker = await prepareServiceWorker(app, config)

  const tmpExists = await fs.exists(config.TMP_DIR)
  if (tmpExists && !config.KEEP_CLIENT) {
    await fs.rmrf(config.TMP_DIR)
    await fs.mkdirp(config.TMP_DIR)
  }

  return app
}

export default prepare
