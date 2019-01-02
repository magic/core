const html = require('./html')
const lib = require('./lib')
const style = require('./css')

const transpile = app => {
  const pages = html(app)
  const bundle = lib(app.lib)
  const css = style(app.style)
  return {
    pages,
    bundle,
    css,
  }
}

transpile.html = html

transpile.lib = lib

transpile.css = style

module.exports = transpile
