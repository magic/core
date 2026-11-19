import http from 'node:http'

import log from '@magic/log'
import { mock } from '@magic/test'

import { checkLinks } from '../../src/lib/checkLinks.mjs'

/** @type {http.Server} */
const server = http.createServer((req, res) => {
  if (req.url === '/ok') {
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('ok')
  } else if (req.url === '/missing') {
    res.writeHead(404)
    res.end('not found')
  } else if (req.url === '/redirect') {
    res.writeHead(301, { location: '/ok' })
    res.end()
  } else {
    res.writeHead(301)
    res.end()
  }
})

server.listen(0, '127.0.0.1')

/** @type {Promise<string>} */
const baseUrl = new Promise(resolve =>
  server.once('listening', () => {
    const addr = server.address() as { port: number }
    resolve(`http://127.0.0.1:${addr.port}`)
  }),
)

/** the spy needs an indexable object, the log interface is not one */
const silentLog = log as unknown as Record<string, unknown>

const silent = async (fn: () => Promise<unknown>) => {
  const spy = mock.spy(silentLog, 'error', () => {})
  const warn = mock.spy(silentLog, 'warn', () => {})
  try {
    return await fn()
  } finally {
    spy.mockRestore()
    warn.mockRestore()
  }
}

const base = { staticUrls: [], pages: [], root: '/' }

export default {
  afterAll: () => new Promise<void>(resolve => server.close(() => resolve())),
  tests: [
    {
      fn: async () => silent(async () => checkLinks({ ...base, links: [`${await baseUrl}/ok`] })),
      expect: [],
      info: 'checkLinks resolves remote 200 links',
    },
    {
      fn: async () =>
        silent(async () => checkLinks({ ...base, links: [`${await baseUrl}/redirect`] })),
      expect: [],
      info: 'checkLinks resolves remote redirect with location',
    },
    {
      fn: async () =>
        silent(async () => checkLinks({ ...base, links: [`${await baseUrl}/redirect-noloc`] })),
      expect: [],
      info: 'checkLinks resolves remote redirect without location',
    },
    {
      fn: async () =>
        silent(async () => checkLinks({ ...base, links: [`${await baseUrl}/missing`] })),
      expect: [],
      info: 'checkLinks logs and resolves remote 404 links',
    },
    {
      fn: async () =>
        silent(async () => checkLinks({ ...base, links: ['http://127.0.0.1:1/closed'] })),
      expect: ['http://127.0.0.1:1/closed'],
      info: 'checkLinks returns remote links with connection errors as unresolved',
    },
  ],
}
