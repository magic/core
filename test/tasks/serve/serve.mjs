import http from 'http'

import { is } from '@magic/test'

import { handler } from '../../../src/tasks/serve/handler.mjs'
import { serve, startServer } from '../../../src/tasks/serve/index.mjs'
import { prepareApi } from '../../../src/tasks/serve/prepareApi.mjs'

/** @returns {Promise<number>} */
const getFreePort = () =>
  new Promise(resolve => {
    const srv = http.createServer()
    srv.listen(0, '127.0.0.1', () => {
      const port = /** @type {import('net').AddressInfo} */ (srv.address()).port
      srv.close(() => resolve(port))
    })
  })

/**
 * @param {number} port
 * @returns {Promise<() => void>}
 */
const occupy = port =>
  new Promise(resolve => {
    const srv = http.createServer(() => {})
    srv.listen(port, '127.0.0.1', () => {
      resolve(() => new Promise(r => srv.close(r)))
    })
  })

const makeApp = over => ({
  client: 'console.log("magic")',
  css: { css: 'body{}', minified: 'body{}' },
  static: { '/file.txt': 'static content' },
  lambdas: {
    ok: async () => async (_req, res) => {
      res.writeHead(200)
      res.end('lambda ok')
    },
    throwing: async () => {
      throw new Error('lambda boom')
    },
    notAFunction: async () => 42,
  },
  pages: [
    { name: '/core/', rendered: '<html>page</html>' },
    { name: '/core/other/', rendered: '<html>other</html>' },
  ],
  ...over,
})

const makeConfig = (over = {}) => ({
  CLIENT_LIB_NAME: 'magic',
  HOST: '127.0.0.1',
  IS_PROD: false,
  PORT: 49999,
  WEB_ROOT: '/core/',
  ...over,
})

/**
 * @param {any} handle
 * @param {number} port
 * @param {string} url
 */
const request = (_handle, port, url) =>
  new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${port}${url}`, res => {
        let data = ''
        res.on('data', d => (data += d))
        res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }))
      })
      .on('error', reject)
  })

export default [
  {
    fn: async () => {
      const server = http.createServer()
      const port = await getFreePort()
      const result = await startServer(server, { port, host: '127.0.0.1' })
      server.close()
      return result.port === port
    },
    expect: true,
    info: 'startServer resolves the port on success',
  },
  {
    fn: async () => {
      const port = await getFreePort()
      const close1 = await occupy(port)
      const close2 = await occupy(port + 1)
      try {
        const server = http.createServer()
        const result = await startServer(server, { port, host: '127.0.0.1' })
        server.close()
        return result.port === port + 2
      } finally {
        await close1()
        await close2()
      }
    },
    expect: true,
    info: 'startServer increments the port while ports are in use',
  },
  {
    fn: async () => {
      // a host that cannot be resolved errors with anything but EADDRINUSE
      const server = http.createServer()
      try {
        await startServer(server, { port: 49990, host: 'magic-test-unresolvable-host.invalid' })
        return false
      } catch (e) {
        return is.error(e)
      } finally {
        server.close()
      }
    },
    expect: true,
    info: 'startServer rethrows non-EADDRINUSE errors',
  },
  {
    fn: async () => {
      const port = await getFreePort()
      /** @type {(() => void)[]} */
      const closers = []
      // occupy the port and all ten retry ports
      for (let i = 0; i <= 10; i += 1) {
        closers.push(await occupy(port + i))
      }
      try {
        const app = makeApp({})
        const server = await serve(app, makeConfig({ PORT: port }))
        // serve swallows the error and returns the (not listening) server
        return is.obj(server)
      } finally {
        for (const close of closers) {
          await close()
        }
      }
    },
    expect: true,
    info: 'serve logs an error when no free port is found',
    timeout: 60000,
  },
  {
    fn: async () => {
      const lambdas = await prepareApi({
        ok: async () => async () => 'fn',
        throwing: async () => {
          throw new Error('lambda boom')
        },
        notAFunction: async () => 42,
      })
      return (
        is.fn(lambdas.ok) &&
        is.fn(lambdas.throwing) &&
        lambdas.throwing !== undefined &&
        lambdas.notAFunction !== undefined
      )
    },
    expect: true,
    info: 'prepareApi falls back to the raw lambda when the result is broken',
  },
  {
    fn: async () => {
      // a request to an existing lambda is handled
      const app = makeApp({})
      const handle = await handler(app, makeConfig())
      const port = await getFreePort()
      const server = http.createServer(handle)
      try {
        await new Promise(resolve => server.listen(port, '127.0.0.1', resolve))
        const res = await request(handle, port, '/core/api/ok')
        return res.status === 200 && res.data === 'lambda ok'
      } finally {
        server.close()
      }
    },
    expect: true,
    info: 'handler serves lambdas from the api',
  },
]
