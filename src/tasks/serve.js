const path = require('path')
const fs = require('fs')
const http = require('http')
const { addTrailingSlash, getContentType } = require('../lib/')

const serve = props => {
  const { transpiled, config } = props
  const css = transpiled.style.minified
  const vendor = transpiled.vendor.minified.code
  const pages = {}
  transpiled.pages.forEach(page => {
    pages[page.name] = page.rendered
  })

  const handler = (req, res) => {
    let url = req.url
    if (url === '/magic.css') {
      res.writeHead(200, 'text/css')
      res.end(css)
      return
    }

    if (url === '/magic.js') {
      res.writeHead(200, 'application/javascript')
      res.end(vendor)
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

    const maybeFilePath = path.join(config.DIR.STATIC, url)
    if (fs.existsSync(maybeFilePath)) {
      const content = fs.readFileSync(maybeFilePath)
      const contentType = getContentType(url)
      res.writeHead(200, contentType)
      res.end(content)
    }

    console.log('404', url)
    res.writeHead(404)
    res.end('Not found')
  }

  http.createServer(handler).listen(3000)
}

module.exports = serve
