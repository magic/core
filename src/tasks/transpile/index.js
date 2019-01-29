const html = require('./html')
const lib = require('./lib')
const style = require('./css')

const transpile = async app => ({
  pages: html(app),
  bundle: lib(app.lib),
  css: await style(app.style),
})

module.exports = transpile
