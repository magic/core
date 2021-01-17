import path from 'path'

import deep from '@magic/deep'
import { h } from '@magic/hyperapp'
import is from '@magic/types'
import log from '@magic/log'

const url = new URL(import.meta.url)
const dirName = path.dirname(url.pathname)

const App = async config => {
  const { WEB_ROOT = '/', LANG = 'en' } = config

  let localApp = {
    state: {},
    actions: {},
    effects: {},
    subscriptions: [],
  }

  let seo = {}

  let { THEME = [] } = config

  if (!is.array(THEME)) {
    THEME = [THEME]
  }

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
        path.join(config.DIR.THEMES, theme_name, 'index.mjs'),
        // npm i -g magic: load magic-themes from node_modules explicitly.
        path.join(config.NODE_MODULES, '@magic-themes', theme_name, 'src', 'index.mjs'),
      ]

      return await Promise.all(
        themeLocations.map(async location => {
          try {
            const { state, actions, effects, subscriptions } = await import(location)

            return {
              state,
              actions,
              effects,
              subscriptions,
            }
          } catch (e) {
            if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
              if (e.name === 'SyntaxError') {
                log.error(
                  'SYNTAX_ERROR',
                  '@magic/core: SyntaxError in your source files. Please run `npm run format` to get more information.',
                )
                process.exit(1)
              }
              throw e
            }
          }
        }),
      )
    }),
  )

  themeData
    .filter(a => a)
    .forEach(theme => {
      theme
        .filter(a => a)
        .forEach((props = {}) => {
          const { state, actions, effects, subscriptions } = props

          if (state) {
            if (is.fn(localApp.state)) {
              localApp.state = localApp.state(config)
            }
            localApp.state = { ...localApp.state, ...state }
          }
          if (actions) {
            localApp.actions = { ...localApp.actions, ...actions }
          }
          if (effects) {
            localApp.effects = { ...localApp.effects, ...effects }
          }
          if (subscriptions) {
            localApp.subscriptions = { ...localApp.subscriptions, ...subscriptions }
          }
        })
    })

  // will be used in the catch clause to make sure it's this file
  // that causes a MODULE_NOT_FOUND error
  const maybeAppFile = path.join(config.ROOT, 'app.mjs')

  try {
    const { default: def, ...maybeApp } = await import(maybeAppFile)

    if (def) {
      let state = def.state
      if (is.fn(def.state)) {
        state = def.state(config)
      }

      const { seo: _, ...s } = state
      seo = state.seo

      localApp = deep.merge(localApp, def)
      if (is.fn(localApp.state)) {
        localApp.state = localApp.state(config)
      }
      localApp.state = { ...localApp.state, ...s }
    } else {
      let state = maybeApp.state
      if (is.fn(maybeApp.state)) {
        state = maybeApp.state(config)
      }

      const { seo: _, ...s } = state
      seo = state.seo

      if (is.fn(maybeApp.state)) {
        maybeApp.state = maybeApp.state(config)
      }
      if (is.fn(localApp.state)) {
        localApp.state = localApp.state(config)
      }

      localApp = deep.merge(localApp, maybeApp)

      localApp.state = { ...localApp.state, ...s }
    }
  } catch (e) {
    // happy without maybeApp
    if (e.code !== 'ERR_MODULE_NOT_FOUND' && !e.message.includes(maybeAppFile)) {
      throw e
    }
  }

  // default app state. gets merged with /assets/app.js if it exists.
  // /assets/app.js overwrites the values defined here.
  let app = deep.merge(localApp, {
    state: {
      url: WEB_ROOT,
      root: WEB_ROOT,
    },

    // this View gets server rendered.
    View: (page, hashes) => state => {
      if (is.fn(localApp.state)) {
        localApp.state = localApp.state(config)
      }
      if (is.fn(state)) {
        state = state(config)
      }

      state = {
        ...localApp.state,
        ...state,
        ...page.state,
        url: page.name,
      }

      const shortJsHash = hashes['/magic.js'].split('-')[1].substr(0, 10)
      const magicJs = {
        src: `${config.WEB_ROOT}${config.CLIENT_LIB_NAME}.js?${shortJsHash}`,
        integrity: hashes['/magic.js'],
        crossorigin: 'anonymous',
      }

      const shortCssHash = hashes['/magic.css'].split('-')[1].substr(0, 10)
      const magicCss = {
        rel: 'stylesheet',
        href: `${config.WEB_ROOT}${config.CLIENT_LIB_NAME}.css?${shortCssHash}`,
        integrity: hashes['/magic.css'],
        crossorigin: 'anonymous',
      }

      const ADD_SCRIPTS =
        config.ADD_SCRIPTS &&
        config.ADD_SCRIPTS.map(src => ({
          src: src,
          integrity: hashes[src],
          crossorigin: 'anonymous',
        }))

      // const shortSwHash = hashes.serviceWorker.split('-')[1].substr(0, 10)
      // const serviceWorker = {
      //   src: `${config.WEB_ROOT}${config.CLIENT_SERVICE_WORKER_NAME}.js?${shortSwHash}`,
      //   integrity: hashes.serviceWorker,
      //   crossorigin: 'anonymous',
      // }

      return [
        h('', { innerHTML: '<!DOCTYPE html>' }),
        html({ lang: state.lang || LANG }, [
          head([
            meta({ charset: 'utf-8' }),
            meta({ 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }),
            meta({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
            Seo({ ...state, seo }),
            link(magicCss),
            page.Head && page.Head(state),
          ]),
          body([
            SkipLink(),
            Page({ page: page.View, state }),
            script(magicJs),
            ADD_SCRIPTS && ADD_SCRIPTS.map(src => script(src)),
            // script(serviceWorker),
          ]),
        ]),
      ]
    },
  })

  // admin
  // if (config.ENV === 'development') {
  //   app.state = deep.merge(Magic.state, app.state)
  //   app.actions = deep.merge(Magic.actions, app.actions)
  // }

  return app
}

export default App
