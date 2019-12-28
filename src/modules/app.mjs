import path from 'path'

import is from '@magic/types'
import deep from '@magic/deep'
import { h } from '@magic/hyperapp'

const App = async config => {
  const { WEB_ROOT = '/', LANG = 'en' } = config

  // default app state. gets merged with /assets/app.js if it exists.
  // /assets/app.js overwrites the values defined here.
  let app = {
    state: {
      url: WEB_ROOT,
      root: WEB_ROOT,
    },

    // this View gets server rendered.
    View: (page, hashes) => state => {
      state.url = page.name

      const shortJsHash = hashes.js.split('-')[1].substr(0, 10)
      const magicJs = {
        src: `${config.WEB_ROOT}${config.CLIENT_LIB_NAME}.js?${shortJsHash}`,
        integrity: hashes.js,
        crossorigin: 'anonymous',
      }

      const shortCssHash = hashes.css.split('-')[1].substr(0, 10)
      const magicCss = {
        rel: 'stylesheet',
        href: `${config.WEB_ROOT}${config.CLIENT_LIB_NAME}.css?${shortCssHash}`,
        integrity: hashes.css,
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
        html({ lang: state.lang || LANG }, [
          head([
            meta({ charset: 'utf-8' }),
            link(magicCss),
            Seo(state),
            page.Head && page.Head(state),
          ]),
          body([
            Page({ page: page.View, state }),
            script(magicJs),
            // script(serviceWorker),
          ]),
        ]),
      ]
    },
  }

  try {
    const maybeAppFile = path.join(config.ROOT, 'app.mjs')
    const { default: def, ...maybeApp } = await import(maybeAppFile)

    if (def) {
      let state = def.state
      if (is.fn(def.state)) {
        state = def.state(config)
      }

      const { seo, ...s } = state
      app = deep.merge(app, { ...def, state: s })
    } else {
      let state = maybeApp.state
      if (is.fn(maybeApp.state)) {
        state = maybeApp.state(config)
      }

      const { seo, ...s } = state
      app = deep.merge(app, { ...maybeApp, state: s })
    }
  } catch (e) {
    // happy without maybeApp
  }

  // admin
  // if (config.ENV === 'development') {
  //   app.state = deep.merge(Magic.state, app.state)
  //   app.actions = deep.merge(Magic.actions, app.actions)
  // }

  return app
}

export default App
