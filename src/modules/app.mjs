import path from 'path'

import deep from '@magic/deep'
import { h } from '@magic/hyperapp'
import log from '@magic/log'
import is from '@magic/types'

import { saveImport } from '../lib/index.mjs'

/** @import { Config, AppObject, PageObject, Hashes, ViewResult } from '../types.mjs' */

const url = new URL(import.meta.url)
const dirName = path.dirname(url.pathname)

/**
 * @param {Config} config
 * @returns {Promise<AppObject>}
 */
const App = async config => {
  const {
    PREPEND_TAGS = [],
    APPEND_TAGS = [],
    PREPEND_SCRIPTS = [],
    APPEND_SCRIPTS = [],
    CLIENT_LIB_NAME,
    DIR,
    LANG = 'en',
    NODE_MODULES,
    ROOT,
    WEB_ROOT,
  } = config

  const rawTheme = config.THEME

  /** @type {string[]} */
  const THEME = is.array(rawTheme) ? rawTheme : is.string(rawTheme) ? [rawTheme] : []

  /** @type {{ state: Record<string, unknown>, actions: Record<string, unknown>, effects: Record<string, unknown>, subscriptions: Record<string, unknown> }} */
  let localApp = {
    state: {},
    actions: {},
    effects: {},
    subscriptions: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ ([])),
  }

  /** @type {{ [key: string]: unknown }} */
  let seo = {}

  const themeData = await Promise.all(
    THEME.map(async theme_name => {
      // order is meaningful.
      const themeLocations = [
        // first look if we have this theme preinstalled in @magic, if so, merge it into the styles
        path.join(dirName, '..', 'themes', theme_name, 'index.mjs'),
        // see if the theme is a full name of a js module in node_modules,
        // eg: theme-name
        theme_name,
        // see if this is a @magic-themes theme
        `@magic-themes/${theme_name}`,
        // see if it is installed locally.
        path.join(DIR.THEMES, theme_name, 'index.mjs'),
        // npm i -g magic: load magic-themes from node_modules explicitly.
        path.join(NODE_MODULES, '@magic-themes', theme_name, 'src', 'index.mjs'),
      ]

      return await Promise.all(
        themeLocations.map(async location => {
          const theme = await saveImport(location)

          if (theme instanceof Error) {
            const themeCode = /** @type {{ code?: string }} */ (theme).code
            if (!themeCode || !themeCode.includes('MODULE_NOT_FOUND')) {
              if (theme.name === 'SyntaxError') {
                log.error(
                  'SYNTAX_ERROR',
                  '@magic/core: SyntaxError in your source files. Please run `npm run format` to get more information.',
                )
                process.exit(1)
              }
              throw theme
            }
            return null
          }

          const { state, actions, effects, subscriptions } = theme

          return {
            state,
            actions,
            effects,
            subscriptions,
          }
        }),
      )
    }),
  )

  themeData
    .filter(a => a !== null)
    .forEach(theme => {
      theme
        .filter(a => a !== null)
        .forEach(props => {
          const { state, actions, effects, subscriptions } = props

          if (state && is.objectNative(state)) {
            if (is.fn(localApp.state)) {
              localApp.state = localApp.state(config)
            }
            localApp.state = { ...localApp.state, ...state }
          }
          if (actions && is.objectNative(actions)) {
            localApp.actions = { ...localApp.actions, ...actions }
          }
          if (effects && is.objectNative(effects)) {
            localApp.effects = { ...localApp.effects, ...effects }
          }
          if (subscriptions && is.objectNative(subscriptions)) {
            localApp.subscriptions = { ...localApp.subscriptions, ...subscriptions }
          }
        })
    })

  // will be used in the catch clause to make sure it's this file
  // that causes a MODULE_NOT_FOUND error
  const maybeAppFileMjs = path.join(ROOT, 'app.mjs')
  const maybeAppFileJs = path.join(ROOT, 'app.js')

  /**
   * @param {string} filePath
   * @returns {Promise<Record<string, unknown> | null>}
   */
  const loadAppFile = async filePath => {
    const result = await saveImport(filePath)
    if (result instanceof Error) {
      return null
    }
    return result
  }

  let appResult = await loadAppFile(maybeAppFileJs)
  if (!appResult) {
    appResult = await loadAppFile(maybeAppFileMjs)
  }

  if (appResult) {
    const { default: def, ...maybeApp } = appResult

    if (is.objectNative(def)) {
      let { state = {} } = def
      if (is.fn(def.state)) {
        state = def.state(config)
      }

      /** @type {Record<string, unknown>} */
      const stateObj = is.objectNative(state) ? state : {}
      const { seo: _seo, ...s } = stateObj
      seo = is.objectNative(stateObj.seo) ? stateObj.seo : {}

      localApp = deep.merge(localApp, def)
      if (is.fn(localApp.state)) {
        localApp.state = localApp.state(config)
      }
      localApp.state = { ...localApp.state, ...s }
    } else {
      let { state = {} } = maybeApp
      if (is.fn(maybeApp.state)) {
        state = maybeApp.state(config)
      }

      /** @type {Record<string, unknown>} */
      const stateObj = is.objectNative(state) ? state : {}
      const { seo: _seo2, ...s } = stateObj
      seo = is.objectNative(stateObj.seo) ? stateObj.seo : {}

      if (is.fn(maybeApp.state)) {
        maybeApp.state = maybeApp.state(config)
      }
      if (is.fn(localApp.state)) {
        localApp.state = localApp.state(config)
      }

      localApp = deep.merge(localApp, maybeApp)

      localApp.state = { ...localApp.state, ...s }
    }
  }

  // default app state. gets merged with /assets/app.js if it exists.
  // /assets/app.js overwrites the values defined here.
  const defaultApp = {
    state: {
      url: WEB_ROOT,
      root: WEB_ROOT,
    },

    // this View gets server rendered,
    // the inner function that accepts state gets used to render this app on the client.
    /**
     * @param {PageObject} page
     * @param {Hashes} hashes
     * @returns {(state: unknown) => ViewResult}
     */
    View:
      (page, hashes) =>
      /**
       * @param {unknown} state
       * @returns {ViewResult}
       */
      state => {
        if (is.fn(localApp.state)) {
          localApp.state = localApp.state(config)
        }
        if (is.fn(state)) {
          state = state(config)
        }

        /** @type {Record<string, unknown>} */
        const stateObj = is.objectNative(state) ? state : {}
        /** @type {Record<string, unknown>} */
        const merged = {
          ...localApp.state,
          ...stateObj,
          ...page.state,
          url: page.name,
        }

        const shortJsHash = hashes['/magic.js'].split('-')[1].substr(0, 10)
        const magicJs = {
          src: `${WEB_ROOT}${CLIENT_LIB_NAME}.js?${shortJsHash}`,
          integrity: hashes['/magic.js'],
          crossorigin: 'anonymous',
          type: 'module',
        }

        const shortCssHash = hashes['/magic.css'].split('-')[1].substr(0, 10)
        const magicCss = {
          rel: 'stylesheet',
          href: `${WEB_ROOT}${CLIENT_LIB_NAME}.css?${shortCssHash}`,
          integrity: hashes['/magic.css'],
          crossorigin: 'anonymous',
        }

        // const shortSwHash = hashes.serviceWorker.split('-')[1].substr(0, 10)
        // const serviceWorker = {
        //   src: `${config.WEB_ROOT}${config.CLIENT_SERVICE_WORKER_NAME}.js?${shortSwHash}`,
        //   integrity: hashes.serviceWorker,
        //   crossorigin: 'anonymous',
        // }

        return [
          h('', { innerHTML: '<!DOCTYPE html>' }),
          html({ lang: merged.lang || LANG }, [
            head([
              meta({ charset: 'utf-8' }),
              meta({ 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }),
              meta({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
              meta({ 'http-equiv': 'Permissions-Policy', content: 'interest-cohort=()' }),
              Seo({ ...merged, seo }),
              link(magicCss),
              page.Head && page.Head(merged),
            ]),

            body([
              SkipLink(),
              PREPEND_TAGS.map(tag => h(tag.name, tag.props, tag.children)),
              Page({ page: page.View, state: merged }),
              APPEND_TAGS.map(tag => h(tag.name, tag.props, tag.children)),

              PREPEND_SCRIPTS.map(scr => script(scr)),
              script(magicJs),
              APPEND_SCRIPTS.map(scr => script(scr)),
              // script(serviceWorker),
            ]),
          ]),
        ]
      },
  }

  const app = deep.merge(defaultApp, localApp)

  // admin
  // if (config.ENV === 'development') {
  //   app.state = deep.merge(Magic.state, app.state)
  //   app.actions = deep.merge(Magic.actions, app.actions)
  // }

  return app
}

export default App
