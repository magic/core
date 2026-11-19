import http from 'http'

import { is } from '@magic/test'

import { startServer, serve } from '../../../src/tasks/serve/index.mjs'

/**
 * find a currently free port by binding to port 0
 * @returns {Promise<number>}
 */
const findFreePort = async () =>
  new Promise((resolve, reject) => {
    const srv = http.createServer()
    srv.once('error', reject)
    srv.listen(0, '127.0.0.1', () => {
      const { port } = /** @type {import('net').AddressInfo} */ (srv.address())
      srv.close(() => resolve(port))
    })
  })

/**
 * occupy a port and return the server so it can be closed
 * @param {number} port
 */
const occupyPort = port =>
  new Promise(resolve => {
    const srv = http.createServer()
    srv.listen(port, '127.0.0.1', () => resolve(srv))
  })

export default [
  {
    fn: async () => {
      const server = http.createServer()
      const options = await startServer(server, { port: 0, host: '127.0.0.1' })
      const { port } = /** @type {import('net').AddressInfo} */ (server.address())
      server.close()
      // options is returned as-is, the assigned port lives on the server
      return is.num(options.port) && port > 0
    },
    expect: true,
    info: 'startServer resolves with options for port 0',
  },
  {
    fn: async () => {
      const free = await findFreePort()
      const squatter = await occupyPort(free)
      try {
        const server = http.createServer()
        const options = await startServer(server, { port: free, host: '127.0.0.1' })
        server.close()
        return options.port === free + 1
      } finally {
        squatter.close()
      }
    },
    expect: true,
    info: 'startServer increments port when the requested port is in use',
  },
  {
    fn: async () => {
      const free = await findFreePort()
      /** @type {import('http').Server[]} */
      const squatters = []
      try {
        // occupy 11 consecutive ports, more than MAX_PORT_RETRIES (10)
        for (let i = 0; i < 11; i += 1) {
          squatters.push(await occupyPort(free + i))
        }
        const server = http.createServer()
        try {
          await startServer(server, { port: free, host: '127.0.0.1' })
          return false
        } catch (e) {
          return is.error(e) && String(e.message).includes('Could not find available port')
        } finally {
          server.close()
        }
      } finally {
        squatters.forEach(s => s.close())
      }
    },
    expect: true,
    info: 'startServer throws after exhausting port retries',
  },
  {
    fn: async () => {
      const server = await serve(
        {
          client: 'client',
          css: { css: 'a{}', minified: 'a{}' },
          static: {},
          pages: [],
          lambdas: {},
        },
        {
          IS_PROD: false,
          CLIENT_LIB_NAME: 'magic',
          HOST: '127.0.0.1',
          PORT: 0,
          WEB_ROOT: '/',
        },
      )
      try {
        const { port } = /** @type {import('net').AddressInfo} */ (server.address())
        const status = await new Promise(resolve => {
          http.get(`http://127.0.0.1:${port}/`, res => resolve(res.statusCode)).end()
        })
        return server instanceof http.Server && status === 302
      } finally {
        server.close()
      }
    },
    expect: true,
    info: 'serve starts a listening http server that answers requests',
  },
  {
    fn: async () => {
      const free = await findFreePort()
      const squatter = await occupyPort(free)
      try {
        const server = await serve(
          {
            client: 'client',
            css: { css: 'a{}', minified: 'a{}' },
            static: {},
            pages: [],
            lambdas: {},
          },
          {
            IS_PROD: false,
            CLIENT_LIB_NAME: 'magic',
            HOST: '127.0.0.1',
            PORT: free,
            WEB_ROOT: '/',
          },
        )
        try {
          const { port } = /** @type {import('net').AddressInfo} */ (server.address())
          return port === free + 1
        } finally {
          server.close()
        }
      } finally {
        squatter.close()
      }
    },
    expect: true,
    info: 'serve increments port when the configured port is in use',
  },
]
