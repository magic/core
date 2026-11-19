import { EventEmitter } from 'events'

import { handler } from '../../../src/tasks/serve/handler.mjs'

/** @param {Record<string, unknown>} [over] */
const makeApp = over => ({
  client: 'client-js',
  css: { css: 'a{color:rgb(1,2,3)}', minified: 'a{color:rgb(1,2,3)}' },
  static: { '/logo.png': 'png-bytes' },
  pages: [
    { name: '/core/', rendered: '<html>home</html>' },
    { name: '/core/about/', rendered: '<html>about</html>' },
  ],
  lambdas: {},
  ...over,
})

/** @param {Record<string, unknown>} [over] */
const makeConfig = over => ({
  IS_PROD: false,
  CLIENT_LIB_NAME: 'magic',
  HOST: 'localhost',
  WEB_ROOT: '/core/',
  FOR_DEATH_CAN_NOT_HAVE_HIM: true,
  ...over,
})

/** @returns {{ code: number | undefined, headers: Record<string, unknown> | undefined, body: unknown, writeHead: Function, end: Function }} */
const makeRes = () => {
  const res = {
    code: undefined,
    headers: undefined,
    body: undefined,
    /** @param {number} code @param {Record<string, unknown>} headers */
    writeHead(code, headers) {
      this.code = code
      this.headers = headers
    },
    /** @param {unknown} body */
    end(body) {
      this.body = body
    },
  }
  return res
}

/** @param {string | undefined} url */
const makeReq = url => {
  /** @type {any} */
  const req = new EventEmitter()
  req.url = url
  req.headers = {}
  return req
}

/**
 * @param {Record<string, unknown>} [appOver]
 * @param {Record<string, unknown>} [configOver]
 */
const makeHandle = async (appOver, configOver) => {
  const handle = await handler(makeApp(appOver), makeConfig(configOver))
  return handle
}

export default [
  {
    fn: async () => {
      const handle = await makeHandle()
      const res = makeRes()
      await handle(makeReq('/core/'), res)
      return (
        res.code === 200 &&
        res.body === '<html>home</html>' &&
        res.headers['Content-Type'] === 'text/html' &&
        res.headers['X-Clacks-Overhead'] === 'GNU Terry Pratchet'
      )
    },
    expect: true,
    info: 'handler serves rendered pages with clacks header',
  },
  {
    fn: async () => {
      const handle = await makeHandle({}, { FOR_DEATH_CAN_NOT_HAVE_HIM: false })
      const res = makeRes()
      await handle(makeReq('/core/'), res)
      return res.code === 200 && res.headers['X-Clacks-Overhead'] === undefined
    },
    expect: true,
    info: 'handler omits clacks header when not requested',
  },
  {
    fn: async () => {
      const handle = await makeHandle()
      const res = makeRes()
      await handle(makeReq('/core/about/'), res)
      return res.code === 200 && res.body === '<html>about</html>'
    },
    expect: true,
    info: 'handler serves nested pages',
  },
  {
    fn: async () => {
      const handle = await makeHandle()
      const res = makeRes()
      await handle(makeReq('/core/magic.css'), res)
      return (
        res.code === 200 &&
        res.headers['Content-Type'] === 'text/css' &&
        res.body === 'a{color:rgb(1,2,3)}'
      )
    },
    expect: true,
    info: 'handler serves css with css content type',
  },
  {
    fn: async () => {
      const handle = await makeHandle()
      const res = makeRes()
      await handle(makeReq('/core/magic.js'), res)
      return (
        res.code === 200 &&
        res.body === 'client-js' &&
        res.headers['Content-Type'] === 'application/javascript'
      )
    },
    expect: true,
    info: 'handler serves client js',
  },
  {
    fn: async () => {
      const handle = await makeHandle()
      const res = makeRes()
      await handle(makeReq('/core/logo.png'), res)
      return res.code === 200 && res.body === 'png-bytes'
    },
    expect: true,
    info: 'handler serves static files',
  },
  {
    fn: async () => {
      const handle = await makeHandle()
      const res = makeRes()
      await handle(makeReq('/core/api/nope'), res)
      return res.code === 404 && res.body === 'Api route not found'
    },
    expect: true,
    info: 'handler 404s unknown api routes',
  },
  {
    fn: async () => {
      const res = makeRes()
      const handle = await makeHandle({
        lambdas: {
          ping: async () => ({ code: 200, body: 'pong' }),
        },
      })
      const req = makeReq('/core/api/ping')
      await handle(req, res)
      req.emit('data', '')
      req.emit('end')
      await new Promise(resolve => setTimeout(resolve, 20))
      return res.code === 200 && res.body === 'pong'
    },
    expect: true,
    info: 'handler routes api calls to lambdas',
  },
  {
    fn: async () => {
      const handle = await makeHandle()
      const res = makeRes()
      await handle(makeReq('/core/unknown'), res)
      return res.code === 302 && res.headers['Location'] === '/core/'
    },
    expect: true,
    info: 'handler redirects unknown urls to web root',
  },
  {
    fn: async () => {
      const handle = await makeHandle()
      const res = makeRes()
      await handle(makeReq('/core/about'), res)
      return res.code === 302 && res.headers['Location'] === '/core/about/'
    },
    expect: true,
    info: 'handler redirects page urls without trailing slash to the page',
  },
  {
    fn: async () => {
      const handle = await makeHandle()
      const res = makeRes()
      await handle(makeReq(undefined), res)
      // url defaults to '/', no page, redirect to web root
      return res.code === 302 && res.headers['Location'] === '/core/'
    },
    expect: true,
    info: 'handler defaults missing url to /',
  },
  {
    fn: async () => {
      // css url check is against raw url without web root
      const handle = await makeHandle()
      const res = makeRes()
      await handle(makeReq('/magic.css'), res)
      return res.code === 200 && res.headers['Content-Type'] === 'text/css'
    },
    expect: true,
    info: 'handler serves css for web root relative requests too',
  },
  {
    fn: async () => {
      const handle = await makeHandle({ static: {} }, { CLIENT_LIB_NAME: 'app' })
      const res = makeRes()
      await handle(makeReq('/app.js'), res)
      return res.code === 200 && res.body === 'client-js'
    },
    expect: true,
    info: 'handler respects custom CLIENT_LIB_NAME',
  },
  {
    fn: async () => {
      // prod serves minified css
      const handle = await makeHandle({ css: { css: 'dev', minified: 'prod' } }, { IS_PROD: true })
      const res = makeRes()
      await handle(makeReq('/core/magic.css'), res)
      return res.body === 'prod'
    },
    expect: true,
    info: 'handler serves minified css in production',
  },
]
