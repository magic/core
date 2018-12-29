const fs = require('fs')
const path = require('path')
const is = require('@magic/types')

const deep = require('@magic/deep')
const { h } = require('hyperapp')

const config = require('../config')

let reset
const maybeResetCssFile = path.join(config.ROOT, 'assets', 'reset.css.js')
if (fs.existsSync(maybeResetCssFile)) {
  reset = require(maybeResetCssFile)
} else {
  reset = require('./reset.css.js')
}

const { html, head, meta, title, link, body, div, script } = require('./tags')

let Menu
const maybeMenuFile = path.join(config.ROOT, 'assets', 'Menu.js')
if (fs.existsSync(maybeMenuFile)) {
  Menu = require(maybeMenuFile)
} else {
  Menu = require('./Menu.js')
}

let style = {
  ...reset,
}

if (config.THEME) {
  const themeFile = path.join(config.ROOT, 'assets', 'themes', config.THEME, 'css.js')
  if (fs.existsSync(themeFile)) {
    style = deep.merge(style, require(themeFile))
  }
}

let app = {
  state: {
    app: {
      title: 'App Title',
      description: 'App Description',
    },
  },

  // default app style
  style,

  View: page => (state, actions) => [
    h('', { innerHTML: '<!DOCTYPE html>' }),
    html([
      head([
        meta({ charset: 'utf-8' }),
        state.title && title(state.title),
        state.description &&
          meta({ name: 'description', property: 'og:description', content: state.description }),
        link({ rel: 'stylesheet', href: '/magic.css' }),
        page.Head && page.Head(state, actions),
      ]),
      body([
        state.menu && Menu(state, actions),
        page.Body && div({ id: 'magic' }, page.Body(state, actions)),
        script({ type: 'text/javascript', src: '/lib.js' }),
        script({ type: 'text/javascript', src: `/js${page.name}index.js` }),
      ]),
    ]),
  ],
}

const maybeAppFile = path.join(config.ROOT, 'app.js')
if (maybeAppFile !== __filename && fs.existsSync(maybeAppFile)) {
  const maybeApp = require(maybeAppFile)
  if (is.object(maybeApp)) {
    app = deep.merge(app, maybeApp)
  }
}

module.exports = app
