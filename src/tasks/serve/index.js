const path = require('path')
const fs = require('fs')
const http = require('http')
const { addTrailingSlash, getContentType, requireNow } = require('../../lib/')
const is = require('@magic/types')

const isProd = process.env.NODE_ENV === 'production'

const watch = require('./watch')

const serve = app => {
  global.app = app
  watch(app)

  const pages = {}
  app.pages.forEach(page => {
    pages[page.name] = page.rendered
  })

  const handler = (req, res) => {
    const { css, lib, static } = global.app
    const style = isProd ? css.minified : css.css
    const js = lib.code

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

    const addedSlashUrl = addTrailingSlash(url)
    if (url !== addedSlashUrl && pages[addedSlashUrl]) {
      res.writeHead(302, {
        'Location': addedSlashUrl,
      })
      res.end()
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
