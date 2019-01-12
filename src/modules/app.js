const path = require('path')

const is = require('@magic/types')
const deep = require('@magic/deep')
const { h } = require('hyperapp')

const { fs } = require('../lib/')
const config = require('../config')

let style = {}

// merge default reset css into styles
const libResetCssFile = path.join(__dirname, '..', 'themes', 'reset.css.js')
style = deep.merge(style, require(libResetCssFile))

// merge user created custom layout into styles, if it exists
const maybeResetCssFile = path.join(config.DIR.THEMES, 'reset.css.js')
if (fs.existsSync(maybeResetCssFile)) {
  style = deep.merge(style, require(maybeResetCssFile))
}


// merge default layout into styles
const existingLayoutCssFile = path.join(__dirname, '..', 'themes', 'layout.css.js')
style = deep.merge(style, require(existingLayoutCssFile))

// merge user created custom layout into styles, if it exists
const maybeLayoutCssFile = path.join(config.DIR.THEMES, 'layout.css.js')
if (fs.existsSync(maybeLayoutCssFile)) {
  style = deep.merge(style, require(maybeLayoutCssFile))
}

// load user's chosen theme, if it is set and exists, and merge it over the styles
if (config.THEME) {
  // first look if we have this theme preinstalled, if so, merge it into the styles
  const libThemeFile = path.join(__dirname, '..', 'themes', config.THEME, 'index.js')
  if (fs.existsSync(libThemeFile)) {
    style = deep.merge(style, require(libThemeFile))
  }

  // load user's custom theme.
  const maybeThemeFile = path.join(config.DIR.THEMES, config.THEME, 'index.js')
  if (fs.existsSync(maybeThemeFile)) {
    style = deep.merge(style, require(maybeThemeFile))
  }
}

// default app state. gets merged with /assets/app.js if it exists.
// /assets/app.js overwrites the values defined here.
let app = {
  state: {
    app: {
      title: 'App Title',
      description: 'App Description',
    },
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
        state.description && description(state.description),
        link({ rel: 'stylesheet', href: '/magic.css' }),
        page.Head && page.Head(state, actions),
      ]),
      body([
        app.Body(page.View, state, actions),
        script({ type: 'text/javascript', src: '/magic.js' }),
      ]),
    ]),
  ],
  Body: (page, state, actions) =>
    div(
      { id: 'magic' },
      div({ class: 'wrapper' }, [
        header({ class: 'main' }, [
          state.logo &&
            img({ class: 'logo', src: state.logo, height: 100, width: 200, role: 'presentation' }),
          state.menu && Menu.View,
        ]),
        page
          ? div({ class: 'page' }, page(state, actions))
          : div({ class: 'page' }, '404 - not found'),
        Footer.View,
      ]),
    ),
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

module.exports = app
