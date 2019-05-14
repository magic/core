import path from 'path'
import URL from 'url'

import { addTrailingSlash, getContentType } from '../../../lib/index.mjs'


export const handler = app => (req, res) => {
  const { isProd } = config
  const { css, client, stat: stat, lambdas } = app
  const WEB_ROOT = addTrailingSlash(config.WEB_ROOT)
  const url = URL.parse(req.url)
  let { pathname } = url

  let Location = WEB_ROOT

  if (pathname.startsWith(WEB_ROOT)) {
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

  if (stat[rawUrl]) {
    const contentType = getContentType(rawUrl)
    res.writeHead(200, { ...headers, 'Content-Type': contentType })
    res.end(stat[rawUrl])
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

export default handler
