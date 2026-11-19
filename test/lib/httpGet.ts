import http from 'node:http'

import { httpGet } from '../../src/lib/httpGet.mjs'

/** @type {http.Server} */
const server = http.createServer((req, res) => {
  if (req.url === '/ok') {
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('hello world')
  } else if (req.url === '/missing') {
    res.writeHead(404)
    res.end('not found')
  } else {
    res.writeHead(301, { location: '/ok' })
    res.end()
  }
})

server.listen(0, '127.0.0.1')

const ready = new Promise<number>(resolve =>
  server.once('listening', () => {
    const addr = server.address() as { port: number }
    resolve(addr.port)
  }),
)

/** httpGet's result, as read by the tests below */
type HttpResponse = {
  statusCode?: number
  headers: Record<string, string | undefined>
  data: Buffer[]
  error?: Error & { code?: string }
}

const url = async (path: string) => `http://127.0.0.1:${await ready}${path}`

export default {
  afterAll: () => new Promise<void>(resolve => server.close(() => resolve())),
  tests: [
    {
      fn: async () => httpGet(await url('/ok')),
      expect: (res: HttpResponse) =>
        res.statusCode === 200 && Buffer.concat(res.data).toString() === 'hello world',
      info: 'httpGet resolves 200 response with data',
    },
    {
      fn: async () => httpGet(await url('/ok')),
      expect: (res: HttpResponse) =>
        res.statusCode === 200 && res.headers['content-type'] === 'text/plain',
      info: 'httpGet resolves headers',
    },
    {
      fn: async () => httpGet(await url('/missing')),
      expect: (res: HttpResponse) => res.statusCode === 404,
      info: 'httpGet resolves 404 response',
    },
    {
      fn: async () => httpGet(await url('/redirect')),
      expect: (res: HttpResponse) => res.statusCode === 301 && res.headers.location === '/ok',
      info: 'httpGet resolves redirect response with location header',
    },
    {
      fn: () => httpGet('http://127.0.0.1:1/never'),
      expect: (res: HttpResponse) => res.error && res.error.code === 'ECONNREFUSED',
      info: 'httpGet resolves connection error',
    },
  ],
}
