import fs from '@magic/fs'

import { addTrailingSlash } from '../../lib/index.mjs'
import { apiHandler } from './apiHandler.mjs'
import { prepareApi } from './prepareApi.mjs'

/** @import { AppObject, Config } from '../../types.mjs' */

/**
 * @param {AppObject} app
 * @param {Config} config
 * @returns {Promise<(req: import('http').IncomingMessage, res: import('http').ServerResponse) => Promise<void>>}
 */
export const handler = async (app, config) => {
  const {
    IS_PROD,
    CLIENT_LIB_NAME,
    //CLIENT_SERVICE_WORKER_NAME,
    FOR_DEATH_CAN_NOT_HAVE_HIM,
    HOST,
  } = config

  const {
    client,
    static: stat,
    lambdas: rawLambdas,
    // sw
  } = app
  const css = /** @type {{ css: string, minified: string }} */ (app.css)

  const WEB_ROOT = addTrailingSlash(config.WEB_ROOT)
  /** @type {Record<string, unknown>} */
  const statObj = /** @type {Record<string, unknown>} */ (stat ?? {})

  const lambdas = await prepareApi(/** @type {Record<string, unknown>} */ (rawLambdas ?? {}))

  return async (req, res) => {
    const url = new URL(req.url ?? '/', `http://${HOST}`)
    let { pathname } = url

    if (pathname.startsWith(WEB_ROOT)) {
      pathname = pathname.replace(WEB_ROOT, '/')
    }

    const rawUrl = url.pathname.replace(WEB_ROOT, '/')

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

    const pages = Object.fromEntries(
      (app.pages ?? []).map(page => [page.name ?? '', page.rendered ?? '']),
    )

    const style = IS_PROD ? css.minified : css.css

    const expiryTime = new Date(new Date().getTime() - 1000).toUTCString()
    /** @type {Record<string, string>} */
    const headers = {
      Expires: expiryTime,
      'Cache-Control': 'no-cache, must-revalidate',
      Pragma: 'no-cache',
    }

    const cssUrl = `/${CLIENT_LIB_NAME}.css`

    if (rawUrl === cssUrl) {
      res.writeHead(200, { ...headers, 'Content-Type': 'text/css' })
      res.end(style)
      return
    }

    const jsUrl = `/${CLIENT_LIB_NAME}.js`
    if (rawUrl === jsUrl) {
      res.writeHead(200, { ...headers, 'Content-Type': 'application/javascript' })
      res.end(client)
      return
    }

    // const swUrl = `/${CLIENT_SERVICE_WORKER_NAME}.js`
    // if (rawUrl === swUrl) {
    //   res.writeHead(200, { ...headers, 'Content-Type': 'application/javascript' })
    //   res.end(sw)
    //   return
    // }

    if (statObj[rawUrl]) {
      const contentType = fs.getContentType(rawUrl)
      res.writeHead(200, { ...headers, 'Content-Type': contentType })
      res.end(/** @type {string} */ (statObj[rawUrl]))
      return
    }

    if (pages[url.pathname]) {
      if (FOR_DEATH_CAN_NOT_HAVE_HIM) {
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
