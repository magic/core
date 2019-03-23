const html = require('./html')
const client = require('./client')
const style = require('./css')

const transpile = async app => ({
  pages: html(app),
  bundle: client(app.client),
  css: await style(app.style),
})

module.exports = transpile
