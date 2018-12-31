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
  const deps = getDependencies({ app, pages })
  const transpiled = transpile.html(deps)
  const vendor = transpile.vendor(transpiled)
  const style = transpile.style(transpiled)

  console.log(Object.keys(deps), Object.keys(transpiled))

  return {
    ...transpiled,
    style,
    vendor,
  }
}

transpile.vendor = props => {
  const vendor = prepare.vendor(props)

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

transpile.html = props => {
  const { app, pages } = props
  let style = {}
  
  pages.forEach(page => {
    page.dependencies.forEach(dep => {
      if (is.object(dep)) {
        Object.entries(dep).forEach(([name, component]) => {
          if (is.object(component)) {
            if (component.state) {
              page.state = deep.merge(component.state, page.state)
            }
            if (component.actions) {
              page.actions = deep.merge(component.actions, page.actions)
            }
            if (component.style) {
              page.style = deep.merge(page.style, component.style)
            }
          }
        })
      }
    })

    page.rendered = renderToString(app.View(page), page.state, page.actions)
  })

  return {
    ...props,
    style,
    pages,
  }
}

transpile.style = ({ app, pages }) => {
  let style = app.style
  pages.forEach(page => {
    style = deep.merge(style, page.style)
  })

  return css(style)
}

transpile.ast = (code, opts) => parse(code, opts)

module.exports = transpile
