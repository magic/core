const is = require('@magic/types')
const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')
const { parse } = require('@babel/parser')
const generate = require('@babel/generator').default
const { renderToString } = require('hyperapp-render')
const css = require('@magic/css')
const deep = require('@magic/deep')

const { mkdirp, getDependencies, isUpperCase, applyWebRoot } = require('../lib')
const modules = require('../modules')
const prepare = require('./prepare')
const config = require('../config')

const isProd = process.env.NODE_ENV === 'production'

const transpile = app => {
  const pages = transpile.html(app)
  const code = transpile.lib(app.lib)
  const css = transpile.css(app.style)
  return {
    pages,
    code,
    css,
  }
}

const presets = [
  [
    '@babel/preset-env',
    {
      targets: '>0.25%, not dead',
      // useBuiltIns: 'entry',
      forceAllTransforms: true,
      ignoreBrowserslistConfig: true,
      modules: false,
      debug: isProd,
    },
  ],
]

const plugins = ['@babel/plugin-transform-arrow-functions']

const babelOpts = {
  filename: 'magic.js',
  minified: isProd,
  comments: !isProd,
  configFile: false,
  sourceMaps: false,
  presets: isProd ? presets : [],
  plugins: isProd ? plugins : [],
}

transpile.html = app => app.pages.map(transpile.page(app))

transpile.page = app => page => {
  const state = deep.merge(page.state, app.state)
  const actions = deep.merge(page.actions, app.actions)
  const rendered = applyWebRoot(renderToString(app.View(page), state, actions))

  return {
    ...page,
    rendered,
  }
}

transpile.lib = lib => {
  const str = lib.str
  const bundle = babel.transformSync(str, babelOpts)
  return bundle.code
}

transpile.css = style => css(style)

module.exports = transpile
