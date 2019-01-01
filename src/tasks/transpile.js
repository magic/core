const is = require('@magic/types')
const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')
const { parse } = require('@babel/parser')
const generate = require('@babel/generator').default
const { renderToString } = require('hyperapp-render')
const css = require('@magic/css')
const deep = require('@magic/deep')

const { mkdirp, getDependencies, isUpperCase } = require('../lib')
const modules = require('../modules')
const prepare = require('./prepare')
const config = require('../config')

const isProd = process.env.NODE_ENV === 'production'

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

const plugins = ['@babel/plugin-transform-arrow-functions', 'minify-dead-code-elimination']

const babelOpts = {
  filename: 'magic.js',
  minified: isProd,
  comments: !isProd,
  configFile: false,
  sourceMaps: false,
  presets: isProd ? presets : [],
  plugins: isProd ? plugins : [],
}

const transpile = () => {
  transpile.html()
  transpile.lib()
  transpile.css()
}

transpile.html = () => {
  global.app.pages.forEach(page => {
    const state = deep.merge(global.app.state, page.state)
    const actions = deep.merge(global.app.actions, page.actions)
    page.rendered = renderToString(app.View(page), state, actions)
  })
}

transpile.lib = () => {
  const str = global.app.lib.str
  const bundle = babel.transformSync(str, babelOpts)

  global.app.lib = {
    ...global.app.lib,
    code: bundle.code,
  }
}

transpile.css = () => {
  global.app.css = css(global.app.style)
}

module.exports = transpile
