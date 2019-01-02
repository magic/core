const fs = require('fs')
const path = require('path')
const is = require('@magic/types')

const deep = require('@magic/deep')
const { h } = require('hyperapp')

const config = require('../config')
const { requireNow } = require('../lib/')

const isProd = process.env.NODE_ENV === 'production'

let reset = {}
const maybeResetCssFile = path.join(config.ROOT, 'themes', 'reset.css.js')
if (fs.existsSync(maybeResetCssFile)) {
  reset = {
    ...reset,
    ...requireNow(maybeResetCssFile),
  }
} 

reset = {
  ...reset,
  ...requireNow(path.join(process.cwd(), 'src', 'modules', 'reset.css.js'))
}

let Menu
const maybeMenuFile = path.join(config.ROOT, 'assets', 'Menu.js')
if (fs.existsSync(maybeMenuFile)) {
  Menu = requireNow(maybeMenuFile)
} else {
  Menu = requireNow(path.join(process.cwd(), 'src', 'modules', 'Menu.js'))
}

let style = {
  ...reset,
}

if (config.THEME) {
  const themeFile = path.join(config.ROOT, 'themes', config.THEME, 'css.js')
  if (fs.existsSync(themeFile)) {
    style = deep.merge(style, requireNow(themeFile))
  }
}

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
        app.Body(page.Body, state, actions),
        script({ type: 'text/javascript', src: '/magic.js' }),
      ]),
    ]),
  ],
  Body: (page, state, actions) =>
    div(
      { id: 'magic' },
      div({ class: 'wrapper' }, [
        header({ class: 'main' }, [
          state.logo && img({ class: 'logo', src: state.logo, role: 'presentation' }),
          state.menu && Menu.View(state, actions),
        ]),
        page && page(state, actions),
      ]),
    ),
}

const maybeAppFile = path.join(config.ROOT, 'app.js')
if (maybeAppFile !== __filename && fs.existsSync(maybeAppFile)) {
  const maybeApp = requireNow(maybeAppFile)
  if (is.object(maybeApp) && !is.empty(maybeApp)) {
    app.state = deep.merge(app.state, maybeApp.state)
    app.actions = deep.merge(app.actions, maybeApp.actions)
    app.style = deep.merge(app.style, maybeApp.style)
  }
}

module.exports = app
