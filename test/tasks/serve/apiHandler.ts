import type { IncomingMessage, ServerResponse } from 'http'

import { EventEmitter } from 'events'

import { is } from '@magic/test'

import { apiHandler } from '../../../src/tasks/serve/apiHandler.mjs'

type FakeRes = {
  code: number | undefined
  headers: Record<string, unknown> | undefined
  body: unknown
  writeHead: (code: number, headers?: Record<string, unknown>) => void
  end: (body?: unknown) => void
}

const makeRes = (): FakeRes => {
  const res: FakeRes = {
    code: undefined,
    headers: undefined,
    body: undefined,
    writeHead(code, headers) {
      this.code = code
      this.headers = headers
    },
    end(body) {
      this.body = body
    },
  }
  return res
}

const makeReq = (headers?: Record<string, string>) => {
  const req = new EventEmitter() as unknown as IncomingMessage & { body?: unknown }
  req.headers = headers ?? {}
  return req
}

const sendBody = async (req: EventEmitter, body: string | Buffer = '') => {
  req.emit('data', body)
  req.emit('end')
  // the end handler is async, give it a few ticks
  await new Promise(resolve => setTimeout(resolve, 20))
}

const handleAndSend = async (
  lambdas: Record<string, unknown>,
  rawUrl: string,
  body: string = '',
  headers?: Record<string, string>,
) => {
  const req = makeReq(headers)
  const res = makeRes()
  const handled = await apiHandler(req, res as unknown as ServerResponse, { lambdas, rawUrl })
  if (handled) {
    await sendBody(req, body)
  }
  return { handled, res, req }
}

export default [
  {
    fn: async () => {
      const res = makeRes()
      const handled = await apiHandler(makeReq(), res as unknown as ServerResponse, {
        lambdas: { a: () => 'x', b: 'static' },
        rawUrl: '/api/',
      })
      const entries = JSON.parse(res.body as string)
      return (
        handled === undefined &&
        res.code === 200 &&
        entries.a === true &&
        entries.b === 'static' &&
        res.headers?.['Content-Type'] === 'text/plain'
      )
    },
    expect: true,
    info: 'apiHandler lists lambdas for /api/',
  },
  {
    fn: async () => {
      const res = makeRes()
      const handled = await apiHandler(makeReq(), res as unknown as ServerResponse, {
        lambdas: { a: () => 'x' },
        rawUrl: '/api',
      })
      return handled === undefined && res.code === 200
    },
    expect: true,
    info: 'apiHandler lists lambdas for /api',
  },
  {
    fn: async () => {
      const res = makeRes()
      const handled = await apiHandler(makeReq(), res as unknown as ServerResponse, {
        lambdas: {},
        rawUrl: '/api/missing',
      })
      return handled === false
    },
    expect: true,
    info: 'apiHandler returns false for unknown modules',
  },
  {
    fn: async () => {
      const handler = async () => ({ code: 201, body: 'created', type: 'application/json' })
      const { handled, res } = await handleAndSend({ mod: { action: handler } }, '/api/mod/action')
      return (
        handled === true &&
        res.code === 201 &&
        res.body === 'created' &&
        res.headers?.['Content-Type'] === 'application/json'
      )
    },
    expect: true,
    info: 'apiHandler calls lambda sub actions with custom response',
  },
  {
    fn: async () => {
      const { handled } = await handleAndSend({ mod: { action: async () => 'x' } }, '/api/mod')
      return handled === false
    },
    expect: true,
    info: 'apiHandler returns false when object lambda has no matching action',
  },
  {
    fn: async () => {
      // a result object without code/body/type uses the defaults
      const { handled, res } = await handleAndSend({ ping: async () => ({}) }, '/api/ping')
      return handled === true && res.code === 500 && res.body === 'Internal Server Error'
    },
    expect: true,
    info: 'apiHandler falls back to 500 when lambda returns no response',
  },
  {
    fn: async () => {
      const { handled, res } = await handleAndSend(
        {
          echo: async (req: { body: { a?: unknown } }) => ({
            code: 200,
            body: String(req.body.a),
            type: 'text/plain',
          }),
        },
        '/api/echo',
        '{"a":1}',
        { 'content-type': 'application/json' },
      )
      return handled === true && res.body === '1'
    },
    expect: true,
    info: 'apiHandler parses json request body',
  },
  {
    fn: async () => {
      const { handled, res } = await handleAndSend(
        {
          echo: async (req: { body?: unknown }) => ({
            code: 200,
            body: is.error(req.body) ? 'parse-error' : 'no-error',
            type: 'text/plain',
          }),
        },
        '/api/echo',
        '{not json',
        { 'content-type': 'application/json' },
      )
      return handled === true && res.body === 'parse-error'
    },
    expect: true,
    info: 'apiHandler passes parse error to lambda for invalid json',
  },
  {
    fn: async () => {
      const req = makeReq()
      const res = makeRes()
      const handled = await apiHandler(req, res as unknown as ServerResponse, {
        lambdas: {
          body: async (request: { body?: unknown }) => ({
            code: 200,
            body: request.body as string,
            type: 'text/plain',
          }),
        },
        rawUrl: '/api/body',
      })
      if (!handled) {
        return false
      }
      // one string chunk, one buffer chunk
      req.emit('data', 'hello ')
      req.emit('data', Buffer.from('world'))
      req.emit('end')
      await new Promise(resolve => setTimeout(resolve, 20))
      return res.body === 'hello world'
    },
    expect: true,
    info: 'apiHandler concatenates string and buffer chunks',
  },
  {
    fn: async () => {
      const req = makeReq()
      const res = makeRes()
      const seen: Record<string, unknown> = {}
      const handled = await apiHandler(req, res as unknown as ServerResponse, {
        lambdas: {
          data: async (request: { body?: unknown }, res2: unknown) => {
            seen.bodyType = typeof request.body
            seen.isRes = res2 === res
            return { code: 200, body: 'ok', type: 'text/plain' }
          },
        },
        rawUrl: '/api/data',
      })
      if (!handled) {
        return false
      }
      await sendBody(req, 'x')
      return seen.bodyType === 'string' && seen.isRes === true
    },
    expect: true,
    info: 'apiHandler passes req body string and res to lambda',
  },
]
