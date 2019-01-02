const path = require('path')
const fs = require('fs')
const http = require('http')
const { addTrailingSlash, getContentType, requireNow } = require('../../lib/')
const is = require('@magic/types')

const isProd = process.env.NODE_ENV === 'production'

const prepare = require('../prepare')
const transpile = require('../transpile')

const watch = () => {
  console.time('watch')

  console.time('prep')
  const newApp = requireNow(path.join(process.cwd(), 'src', 'modules', 'app.js'))
  const prep = prepare(newApp)
  console.timeEnd('prep')

  console.time('transpile')
  const { pages, css, code }= transpile(prep)
  prep.pages = pages
  prep.css = css
  prep.lib.code = code
  console.timeEnd('transpile')

  global.app = prep

  console.timeEnd('watch')
  setTimeout(() => watch(app), 500)
}

module.exports = watch
