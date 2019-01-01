const path = require('path')
const fs = require('fs')
const http = require('http')
const { addTrailingSlash, getContentType } = require('../lib/')

const isProd = process.env.NODE_ENV === 'production'

const serve = () => {
  const { css, lib, static } = global.app
  const style = isProd ? css.minified : css.css
  const js = isProd ? lib.minified.code : lib.bundle.code

  const pages = {}
  global.app.pages.forEach(page => {
    pages[page.name] = page.rendered
  })

  const handler = (req, res) => {
    let url = req.url
    if (url === '/magic.css') {
      res.writeHead(200, 'text/css')
      res.end(style)
      return
    }

    if (url === '/magic.js' || url === '/magic.min.js') {
      res.writeHead(200, 'application/javascript')
      res.end(js)
      return
    }

    if (pages[addTrailingSlash(url)]) {
      url = addTrailingSlash(url)
    }

    if (pages[url]) {
      res.writeHead(200, 'text/html')
      res.end(pages[req.url])
      return
    }

    if (static[url]) {
      const contentType = getContentType(url)
      res.writeHead(200, contentType)
      res.end(static[url])
      return
    }

    console.log('404', url)
    res.writeHead(404)
    res.end('Not found')
  }

  http.createServer(handler).listen(3000)
}

module.exports = serve
