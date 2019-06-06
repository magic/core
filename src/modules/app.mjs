import path from 'path'

import is from '@magic/types'
import deep from '@magic/deep'
import { h } from 'hyperapp'

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
      const shortCssHash = hashes.css.split('-')[1].substr(0, 10)

      return [
        h('', { innerHTML: '<!DOCTYPE html>' }),
        html({ lang: state.lang || LANG }, [
          head([
            meta({ charset: 'utf-8' }),
            link({ rel: 'icon', href: '/favicon.ico' }),
            !is.empty(state.title) && title(state.title),
            !is.empty(state.description) &&
              meta({
                name: 'description',
                content: is.array(state.description)
                  ? state.description.join(' ')
                  : state.description,
              }),
            !is.empty(state.keywords) &&
              meta({
                name: 'keywords',
                content: is.array(state.keywords) ? state.keywords.join(' ') : state.keywords,
              }),
            !is.empty(state.author) && meta({ name: 'author', content: state.author }),
            link({
              rel: 'stylesheet',
              href: `${config.WEB_ROOT}${config.CLIENT_LIB_NAME}.css?${shortCssHash}`,
              integrity: hashes.css,
              crossorigin: 'anonymous',
            }),
            page.Head && page.Head(state),
          ]),
          body([
            Page({ page: page.View, state }),
            script({
              src: `${config.WEB_ROOT}${config.CLIENT_LIB_NAME}.js?${shortJsHash}`,
              integrity: hashes.js,
              crossorigin: 'anonymous',
            }),
          ]),
        ]),
      ]
    },
  }

  try {
    const maybeAppFile = path.join(config.ROOT, 'app.mjs')
    const { default: def, ...maybeApp } = await import(maybeAppFile)

    if (def) {
      app = deep.merge(app, { ...def })
    } else {
      app = deep.merge(app, { ...maybeApp })
    }
  } catch (e) {
    // happy without maybApp
  }

  // admin
  // if (config.ENV === 'development') {
  //  app.state = deep.merge(Magic.state, app.state)
  //  app.actions = deep.merge(Magic.actions, app.actions)
  // }
  return app
}

export default App
