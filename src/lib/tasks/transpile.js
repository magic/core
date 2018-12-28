const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const generate = require('@babel/generator').default
const { renderToString } = require('hyperapp-render')
const css = require('@magic/css')
const deep = require('@magic/deep')

const app = require('../modules/app')
const mkdirp = require('../mkdirp')
const modules = require('../modules')
const prepare = require('./prepare')
const config = require('../../config')

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

const transpile = {
  vendor: (components, tags) => {
    const vendor = prepare.vendor({ components, tags })

    babelOpts.filename = 'vendor'
    const ast = transpile.ast(vendor, babelOpts)

    const { code } = generate(ast, babelOpts)
    babelOpts.minified = true
    const minified = generate(ast, babelOpts)

    fs.writeFileSync(path.join(config.DIR.TMP, 'vendor.js'), code)
    fs.writeFileSync(path.join(config.DIR.TMP, 'vendor.min.js'), minified.code)
  },
  pages: pages => {
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
      fs.writeFileSync(pagePath, page.rendered)
    })

    return style
  },
  style: style => {
    const preparedStyle = css(style)
    fs.writeFileSync(path.join(config.DIR.TMP, 'main.css'), preparedStyle.minified)
  },
  ast: (code, opts) => parse(code, opts),
}

module.exports = transpile