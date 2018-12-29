const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const generate = require('@babel/generator').default
const { renderToString } = require('hyperapp-render')
const css = require('@magic/css')
const deep = require('@magic/deep')

const { mkdirp, getDependencies } = require('../lib')
const modules = require('../modules')
const prepare = require('./prepare')
const config = require('../config')

let presets = [
  [
    'env',
    {
      modules: false,
      targets: {
        browsers: ['last 2 versions', 'safari >= 7'],
      },
    },
  ],
]

const babelOpts = {
  sourceMaps: 'both',
  presets,
}

const transpile = ({ app, pages }) => {
  const { dependencies, components, tags } = getDependencies(pages, app)

  const transpiled = transpile.html(app, pages)
  const vendor = transpile.vendor(components, tags, dependencies)
  const style = transpile.style(transpiled.style)

  return {
    style,
    vendor,
    pages: transpiled.pages,
    app,
    dependencies,
    components,
    tags,
  }
}

transpile.vendor = (components, tags) => {
  const vendor = prepare.vendor({ components, tags })

  babelOpts.filename = 'vendor'
  const ast = transpile.ast(vendor, babelOpts)
  const bundle = generate(ast, babelOpts)

  babelOpts.minified = true
  babelOpts.comments = false
  const minified = generate(ast, babelOpts)

  return {
    ast,
    bundle,
    minified,
  }
}

transpile.html = (app, pages) => {
  let style = {}
  pages.forEach(page => {
    page.dependencies = prepare.dependencies(page.str)
    page.dependencies.forEach(dep => {
      const lib = modules[dep] || {}
      if (lib.state) {
        page.state = deep.merge(lib.state, page.state)
      }
      if (lib.actions) {
        page.actions = deep.merge(lib.actions, page.actions)
      }
      if (lib.style) {
        page.style = deep.merge(lib.style, page.style)
      }
    })

    page.rendered = renderToString(app.View(page), page.state, page.actions)
    style = deep.merge(style, page.style)
    let pagePath = path.join(config.DIR.TMP, page.name)
    mkdirp(pagePath)
    if (!pagePath.endsWith('index.js') && pagePath.endsWith('/')) {
      pagePath = path.join(pagePath, 'index.html')
    }
  })

  return {
    style,
    pages,
  }
}

transpile.style = style => css(style)

transpile.ast = (code, opts) => parse(code, opts)

module.exports = transpile
