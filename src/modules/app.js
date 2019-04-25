const path = require('path')

const is = require('@magic/types')
const deep = require('@magic/deep')
const { h } = require('hyperapp')

const { fs } = require('../lib/')
const config = require('../config')
// const { ENV } = config
const Magic = require('./admin')

const { WEB_ROOT = '/', LANG = 'en' } = config

// default app state. gets merged with /assets/app.js if it exists.
// /assets/app.js overwrites the values defined here.
let app = {
  state: {
    url: WEB_ROOT,
  },

  // this View gets server rendered.
  View: page => (state, actions) => {
    state.url = page.name

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
          link({ rel: 'stylesheet', href: '/' + config.CLIENT_LIB_NAME + '.css' }),
          page.Head && page.Head(state, actions),
        ]),
        body([
          app.Body(page.View, state, actions),
          script({ type: 'text/javascript', src: '/' + config.CLIENT_LIB_NAME + '.js' }),
        ]),
      ]),
    ]
  },
  Body: Magic.View,
}

const libIndex = path.join(config.DIR.ASSETS, 'lib.js')
if (fs.existsSync(libIndex)) {
  const libFiles = require(libIndex)
  app.lib = Object.entries(libFiles).map(([name, file]) => {
    if (typeof global[name] !== 'undefined') {
      throw new Error(`Name clash: global.${name} would be overwritten by lib import`)
    }

    const localLibFile = path.join(config.DIR.ASSETS, file)
    try {
      if (fs.existsSync(localLibFile)) {
        global[name] = require(localLibFile)
        file = localLibFile
      } else {
        global[name] = require(file)
      }

      return [name, file]
    } catch (e) {
      throw new Error(`Error in assets/lib.js: Could not find imported lib '${name}' in ${file}`)
    }
  })
}

const maybeAppFile = path.join(config.ROOT, 'app.js')
if (maybeAppFile !== __filename && fs.existsSync(maybeAppFile)) {
  const maybeApp = require(maybeAppFile)
  if (is.object(maybeApp) && !is.empty(maybeApp)) {
    app.state = deep.merge(app.state, maybeApp.state)
    app.actions = deep.merge(app.actions, maybeApp.actions)
  }
}

if (config.ENV === 'development') {
  app.state = deep.merge(Magic.state, app.state)
  app.actions = deep.merge(Magic.actions, app.actions)
}

module.exports = app
