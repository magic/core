const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const generate = require('@babel/generator').default
const { renderToString } = require('hyperapp-render')
const css = require('@magic/css')
const deep = require('@magic/deep')

const { mkdirp, getDependencies } = require('../lib')
const modules = require('../modules')
const transpile = require('./transpile')
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

const write = (pages, app) => {
  const { dependencies, components, tags } = getDependencies(pages, app)

  const style = write.html(pages, app)
  write.vendor(components, tags, dependencies)
  write.style(style)
}

write.vendor = (components, tags) => {
  const vendor = transpile.vendor({ components, tags })

  babelOpts.filename = 'vendor'
  const ast = write.ast(vendor, babelOpts)

  const { code } = generate(ast, babelOpts)
  babelOpts.minified = true
  babelOpts.comments = false

  const minified = generate(ast, babelOpts)

  fs.writeFileSync(path.join(config.DIR.TMP, 'vendor.js'), code)
  fs.writeFileSync(path.join(config.DIR.TMP, 'vendor.min.js'), minified.code)
}

write.html = (pages, app) => {
  let style = {}
  pages.forEach(page => {
    page.dependencies = transpile.dependencies(page.str)
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
}

write.style = style => {
  const transpiledStyle = css(style)
  fs.writeFileSync(path.join(config.DIR.TMP, 'main.css'), transpiledStyle.minified)
}

write.ast = (code, opts) => parse(code, opts)

module.exports = write
