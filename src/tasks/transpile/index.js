const html = require('./html')
const lib = require('./lib')
const style = require('./css')

const transpile = app => ({
  pages: html(app),
  bundle: lib(app.lib),
  css: style(app.style),
})

module.exports = transpile
