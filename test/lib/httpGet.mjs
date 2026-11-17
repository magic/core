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

/** @type {Promise<number>} */
const ready = new Promise(resolve =>
  server.once('listening', () =>
    resolve(/** @type {import('net').AddressInfo} */ (server.address()).port),
  ),
)

const url = async path => `http://127.0.0.1:${await ready}${path}`

export default {
  afterAll: () => new Promise(resolve => server.close(() => resolve())),
  tests: [
    {
      fn: async () => httpGet(await url('/ok')),
      expect: res => res.statusCode === 200 && Buffer.concat(res.data).toString() === 'hello world',
      info: 'httpGet resolves 200 response with data',
    },
    {
      fn: async () => httpGet(await url('/ok')),
      expect: res => res.statusCode === 200 && res.headers['content-type'] === 'text/plain',
      info: 'httpGet resolves headers',
    },
    {
      fn: async () => httpGet(await url('/missing')),
      expect: res => res.statusCode === 404,
      info: 'httpGet resolves 404 response',
    },
    {
      fn: async () => httpGet(await url('/redirect')),
      expect: res => res.statusCode === 301 && res.headers.location === '/ok',
      info: 'httpGet resolves redirect response with location header',
    },
    {
      fn: () => httpGet('http://127.0.0.1:1/never'),
      expect: res => res.error && res.error.code === 'ECONNREFUSED',
      info: 'httpGet resolves connection error',
    },
  ],
}
