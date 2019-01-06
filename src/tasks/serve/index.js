const http = require('http')
const { addTrailingSlash, getContentType } = require('../../lib/')

const isProd = process.env.NODE_ENV === 'production'

const watch = require('./watch')

const serve = app => {
  global.app = app
  watch()

  const handler = (req, res) => {
    const { css, lib, static } = global.app

    const pages = {}
    app.pages.forEach(page => {
      pages[page.name] = page.rendered
    })

    const style = isProd ? css.minified : css.css

    const js = lib.bundle.code

    const WEB_ROOT = addTrailingSlash(config.WEB_ROOT || '/')
    let url = req.url//.replace(WEB_ROOT, '/')
    const rawUrl = url.replace(config.WEB_ROOT, '/')

    if (rawUrl === '/magic.css') {
      res.writeHead(200, 'text/css')
      res.end(style)
      return
    }

    if (rawUrl === '/magic.js') {
      res.writeHead(200, 'application/javascript')
      res.end(js)
      return
    }

    if (static[rawUrl]) {
      const contentType = getContentType(rawUrl)
      res.writeHead(200, contentType)
      res.end(static[rawUrl])
      return
    }

    const addedSlashUrl = addTrailingSlash(rawUrl)
    const isWebRoot = addedSlashUrl === WEB_ROOT

    let redirect = ''
    if (isWebRoot || (rawUrl !== addedSlashUrl && pages[addedSlashUrl])) {
      redirect = addedSlashUrl
    } else if (req.url === '/' && WEB_ROOT !== '/') {
      if (isProd) {
        redirect = WEB_ROOT
      }
    }

    if (redirect) {
      res.writeHead(302, {
        Location: redirect,
      })
      res.end()
      return
    }

    // fall back to 404 page
    // which got added automatically.
    if (!pages[url]) {
      url = '/404/'
    }

    res.writeHead(200, 'text/html')
    res.end(pages[url])
  }

  http.createServer(handler).listen(3000, () => {
    console.log('listening to http://localhost:3000')
  })
}

module.exports = serve
