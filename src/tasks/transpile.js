const is = require('@magic/types')
const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const generate = require('@babel/generator').default
const { renderToString } = require('hyperapp-render')
const css = require('@magic/css')
const deep = require('@magic/deep')

const { mkdirp, getDependencies, isUpperCase } = require('../lib')
const modules = require('../modules')
const prepare = require('./prepare')
const config = require('../config')

let presets = [
  [
    'env',
    {
      modules: false,
      targets: {
        ie: '8',
        // browsers: ['last 2 versions', 'safari >= 7'],
      },
    },
  ],
]

const babelOpts = {
  sourceMaps: 'both',
  presets,
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
  babelOpts.filename = 'magic'
  const str = global.app.lib.str
  const ast = parse(str, babelOpts)
  const bundle = generate(ast, babelOpts)

  babelOpts.minified = true
  babelOpts.comments = false
  const minified = generate(ast, babelOpts)

  global.app.lib = {
    ...global.app.lib,
    ast,
    bundle,
    minified,
  }
}

transpile.css = () => {
  global.app.css = css(global.app.style)
}

module.exports = transpile
