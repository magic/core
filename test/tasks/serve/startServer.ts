import type { AppObject, Config } from '../../../src/types.mjs'

import http from 'http'

import { is } from '@magic/test'

import { startServer, serve } from '../../../src/tasks/serve/index.mjs'

const findFreePort = () =>
  new Promise<number>((resolve, reject) => {
    const srv = http.createServer()
    srv.once('error', reject)
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address() as { port: number }
      srv.close(() => resolve(port))
    })
  })

const occupyPort = (port: number) =>
  new Promise<http.Server>(resolve => {
    const srv = http.createServer()
    srv.listen(port, '127.0.0.1', () => resolve(srv))
  })

export default [
  {
    fn: async () => {
      const server = http.createServer()
      const options = await startServer(server, { port: 0, host: '127.0.0.1' })
      const { port } = server.address() as { port: number }
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
      const squatters: http.Server[] = []
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
        } as unknown as AppObject,
        {
          IS_PROD: false,
          CLIENT_LIB_NAME: 'magic',
          HOST: '127.0.0.1',
          PORT: 0,
          WEB_ROOT: '/',
        } as unknown as Config,
      )
      try {
        const { port } = server.address() as { port: number }
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
          } as unknown as AppObject,
          {
            IS_PROD: false,
            CLIENT_LIB_NAME: 'magic',
            HOST: '127.0.0.1',
            PORT: free,
            WEB_ROOT: '/',
          } as unknown as Config,
        )
        try {
          const { port } = server.address() as { port: number }
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
