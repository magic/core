const path = require('path')

const is = require('@magic/types')
const deep = require('@magic/deep')
const { h } = require('hyperapp')

const { fs } = require('../lib/')
const config = require('../config')
// const { ENV } = config
const Magic = require('./admin')

let style = {}

const variables = config.THEME_VARS || {}

// merge user created custom layout into styles, if it exists
const maybeResetCssFile = path.join(config.DIR.THEMES, 'reset.css.js')
if (fs.existsSync(maybeResetCssFile)) {
  style = deep.merge(style, require(maybeResetCssFile))
} else {
  // merge default reset css into styles if no custom reset file exists
  const libResetCssFile = path.join(__dirname, '..', 'themes', 'reset.css.js')
  style = deep.merge(style, require(libResetCssFile))
}

// merge user created custom layout into styles, if it exists
const maybeLayoutCssFile = path.join(config.DIR.THEMES, 'layout.css.js')
if (fs.existsSync(maybeLayoutCssFile)) {
  style = deep.merge(style, require(maybeLayoutCssFile))
} else {
  // merge default layout into styles if no custom layout file exists
  const existingLayoutCssFile = path.join(__dirname, '..', 'themes', 'layout.css.js')
  style = deep.merge(style, require(existingLayoutCssFile))
}

// load user's chosen theme, if it is set and exists, and merge it over the styles
if (config.THEME) {
  // first look if we have this theme preinstalled, if so, merge it into the styles
  const libThemeFile = path.join(__dirname, '..', 'themes', config.THEME, 'index.js')

  if (fs.existsSync(libThemeFile)) {
    let theme = require(libThemeFile)
    if (is.function(theme)) {
      theme = theme(variables)
    }
    style = deep.merge(style, theme)
  }

  // now look if it exists in node_modules
  try {
    let theme = require(`@magic-themes/${config.THEME}`)
    if (is.function(theme)) {
      theme = theme(variables)
    }
    style = deep.merge(style, theme)
  } catch (e) {
    // theme does not exist in node_modules, continue happily.
  }

  // load user's custom theme, overwriting both preinstalled and node_modules themes
  const maybeThemeFile = path.join(config.DIR.THEMES, config.THEME, 'index.js')
  if (fs.existsSync(maybeThemeFile)) {
    let theme = require(maybeThemeFile)
    if (is.function(theme)) {
      theme = theme(variables)
    }
    style = deep.merge(style, theme)
  }
}

// default app state. gets merged with /assets/app.js if it exists.
// /assets/app.js overwrites the values defined here.
let app = {
  state: {
    url: '/',
  },

  // default app style
  style,

  // this View gets server rendered.
  View: page => (state, actions) => [
    h('', { innerHTML: '<!DOCTYPE html>' }),
    html([
      head([
        meta({ charset: 'utf-8' }),
        link({ rel: 'icon', href: '/favicon.ico' }),
        state.title && title(state.title),
        state.description &&
          meta({
            name: 'description',
            content: is.array(state.description) ? state.description.join(' ') : state.description,
          }),
        state.keywords && meta({ name: 'keywords', content: state.keywords }),
        state.author && meta({ name: 'author', content: state.author }),
        link({ rel: 'stylesheet', href: '/magic.css' }),
        page.Head && page.Head(state, actions),
      ]),
      body([
        app.Body(page.View, state, actions),
        script({ type: 'text/javascript', src: '/magic.js' }),
      ]),
    ]),
  ],
  Body: Magic.View,
}

const maybeAppFile = path.join(config.ROOT, 'app.js')
if (maybeAppFile !== __filename && fs.existsSync(maybeAppFile)) {
  const maybeApp = require(maybeAppFile)
  if (is.object(maybeApp) && !is.empty(maybeApp)) {
    app.state = deep.merge(app.state, maybeApp.state)
    app.actions = deep.merge(app.actions, maybeApp.actions)
    app.style = deep.merge(app.style, maybeApp.style)
  }
}

if (config.ENV === 'development') {
  app.state = deep.merge(Magic.state, app.state)
  app.actions = deep.merge(Magic.actions, app.actions)
  app.style = deep.merge(Magic.style, app.style)
}

module.exports = app
