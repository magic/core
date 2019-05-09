const URL = require('url')

const { addTrailingSlash, getContentType } = require('../../../lib/')

const isProd = config.ENV === 'production'

const handler = app => (req, res) => {
  const { css, client, static, lambdas } = app
  const WEB_ROOT = addTrailingSlash(config.WEB_ROOT)
  const url = URL.parse(req.url)
  let { pathname } = url

  const Location = WEB_ROOT

  if (!pathname.startsWith(WEB_ROOT)) {
    console.log({ pathname, WEB_ROOT })
    res.writeHead(302, { Location })
    res.end()
    return
  } else {
    pathname = pathname.replace(WEB_ROOT, '/')
  }

  const rawUrl = url.pathname.replace(config.WEB_ROOT, '/')

  if (rawUrl.startsWith('/api')) {
    const action = rawUrl.replace('/api/', '').replace('/', '')
    if (typeof lambdas[action] === 'function') {
      req.body = ''
      req.on('data', chunk => (req.body += chunk))

      req.on('end', (...args) => lambdas[action](req, res, ...args))
      return
    }
  }

  const pages = {}
  app.pages.forEach(page => {
    pages[page.name] = page.rendered
  })

  const style = isProd ? css.minified : css.css

  const js = client.bundle

  const expiryTime = new Date(new Date().getTime() - 1000).toUTCString()
  const headers = {
    Expires: expiryTime,
    'Cache-Control': 'no-cache, must-revalidate',
    Pragma: 'no-cache',
  }

  if (config.FOR_DEATH_CAN_NOT_HAVE_HIM) {
    headers['X-Clacks-Overhead'] = 'GNU Terry Pratchet'
  }

  const cssUrl = `/${config.CLIENT_LIB_NAME}.css`

  if (rawUrl === cssUrl) {
    res.writeHead(200, { ...headers, 'Content-Type': 'text/css' })
    res.end(style)
    return
  }

  const jsUrl = `/${config.CLIENT_LIB_NAME}.js`
  if (rawUrl === jsUrl) {
    res.writeHead(200, { ...headers, 'Content-Type': 'application/javascript' })
    res.end(js)
    return
  }

  if (static[rawUrl]) {
    const contentType = getContentType(rawUrl)
    res.writeHead(200, { ...headers, 'Content-Type': contentType })
    res.end(static[rawUrl])
    return
  }

  const addedSlashUrl = addTrailingSlash(rawUrl)
  const isWebRoot = addedSlashUrl === WEB_ROOT

  let redirect = ''
  if (!isWebRoot && (rawUrl !== addedSlashUrl && pages[addedSlashUrl])) {
    redirect = addedSlashUrl
  } else if (req.url === '/' && WEB_ROOT !== '/') {
    redirect = WEB_ROOT
  }

  if (redirect) {
    res.writeHead(302, {
      ...headers,
      Location: redirect,
    })
    res.end()
    return
  }

  const page = pages[url.pathname]
  if (page) {
    res.writeHead(200, { ...headers, 'Content-Type': 'text/html' })
    res.end(page)
    return
  }

  // 404. in development, we redirect to the root

  res.writeHead(302, { Location })
  res.end()
}

module.exports = handler
