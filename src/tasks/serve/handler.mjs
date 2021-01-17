import URL from 'url'

import fs from '@magic/fs'

import { addTrailingSlash } from '../../lib/index.mjs'
import { prepareApi } from './prepareApi.mjs'
import { apiHandler } from './apiHandler.mjs'

export const handler = async app => {
  const { IS_PROD } = config
  const { css, client, static: stat, lambdas: rawLambdas, sw } = app
  const WEB_ROOT = addTrailingSlash(config.WEB_ROOT)

  const lambdas = await prepareApi(rawLambdas)

  return async (req, res) => {
    const url = URL.parse(req.url)
    let { pathname } = url

    if (pathname.startsWith(WEB_ROOT)) {
      pathname = pathname.replace(WEB_ROOT, '/')
    }

    const rawUrl = url.pathname.replace(config.WEB_ROOT, '/')

    if (rawUrl.startsWith('/api')) {
      const handled = await apiHandler(req, res, { lambdas, rawUrl })
      if (handled) {
        return
      } else {
        const headers = {
          'Cache-Control': 'no-cache, must-revalidate',
          Pragma: 'no-cache',
          'Content-Type': 'text/plain',
        }

        res.writeHead(404, headers)
        res.end('Api route not found')
        return
      }
    }

    const pages = Object.fromEntries(app.pages.map(page => [page.name, page.rendered]))

    const style = IS_PROD ? css.minified : css.css

    const expiryTime = new Date(new Date().getTime() - 1000).toUTCString()
    const headers = {
      Expires: expiryTime,
      'Cache-Control': 'no-cache, must-revalidate',
      Pragma: 'no-cache',
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
      res.end(client)
      return
    }

    // const swUrl = `/${config.CLIENT_SERVICE_WORKER_NAME}.js`
    // if (rawUrl === swUrl) {
    //   res.writeHead(200, { ...headers, 'Content-Type': 'application/javascript' })
    //   res.end(sw)
    //   return
    // }

    if (stat[rawUrl]) {
      const contentType = fs.getContentType(rawUrl)
      res.writeHead(200, { ...headers, 'Content-Type': contentType })
      res.end(stat[rawUrl])
      return
    }

    if (pages[url.pathname]) {
      if (config.FOR_DEATH_CAN_NOT_HAVE_HIM) {
        headers['X-Clacks-Overhead'] = 'GNU Terry Pratchet'
      }

      res.writeHead(200, { ...headers, 'Content-Type': 'text/html' })
      res.end(pages[url.pathname])
      return
    }

    // 404. we redirect to the root
    let Location = WEB_ROOT

    if (pages[`${url.pathname}/`]) {
      Location = `${url.pathname}/`
    }

    res.writeHead(302, { Location })
    res.end()
  }
}
