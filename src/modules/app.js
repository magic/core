const path = require('path')

const is = require('@magic/types')
const deep = require('@magic/deep')
const { h } = require('hyperapp')

const { fs, requireNow } = require('../lib/')
const config = require('../config')

let style = {}

const libResetCssFile = path.join(__dirname, '..', 'themes', 'reset.css.js')
style = deep.merge(style, requireNow(libResetCssFile))

const maybeResetCssFile = path.join(config.ROOT, 'themes', 'reset.css.js')
if (fs.existsSync(maybeResetCssFile)) {
  style = deep.merge(style, requireNow(maybeResetCssFile))
}

const existingLayoutCssFile = path.join(__dirname, '..', 'themes', 'layout.css.js')
style = deep.merge(style, requireNow(existingLayoutCssFile))

const maybeLayoutCssFile = path.join(config.ROOT, 'themes', 'layout.css.js')
if (fs.existsSync(maybeLayoutCssFile)) {
  style = deep.merge(style, requireNow(maybeLayoutCssFile))
}


if (config.THEME) {
  const libThemeFile = path.join(__dirname, '..', 'themes', config.THEME, 'index.js')
  if(fs.existsSync(libThemeFile)) {
    style = deep.merge(style, requireNow(libThemeFile))
  }

  const maybeThemeFile = path.join(config.ROOT, 'themes', config.THEME, 'index.js')
  if (fs.existsSync(maybeThemeFile)) {
    style = deep.merge(style, requireNow(maybeThemeFile))
  }
}

let Menu = requireNow(path.join(__dirname, '..', 'modules', 'Menu.js'))
const maybeMenuFile = path.join(config.ROOT, 'assets', 'Menu.js')
if (fs.existsSync(maybeMenuFile)) {
  Menu = deep.merge(Menu, requireNow(maybeMenuFile))
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
          state.logo &&
            img({ class: 'logo', src: state.logo, height: 100, width: 200, role: 'presentation' }),
          state.menu && Menu.View(state, actions),
        ]),
        page ? page(state, actions) : div('404 - not found'),
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
