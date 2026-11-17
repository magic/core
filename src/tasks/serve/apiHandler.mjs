import log from '@magic/log'
import is from '@magic/types'

/**
 * @param {import('http').IncomingMessage & { body?: unknown }} req
 * @param {import('http').ServerResponse} res
 * @param {{ lambdas: Record<string, unknown>, rawUrl: string }} params
 * @returns {Promise<boolean | undefined>}
 */
export const apiHandler = async (req, res, { lambdas, rawUrl }) => {
  if (rawUrl === '/api/' || rawUrl === '/api') {
    const code = 200

    const lambdaEntries = Object.fromEntries(
      Object.entries(lambdas).map(([k, v]) => [k, typeof v === 'function' ? true : v]),
    )

    const body = JSON.stringify(lambdaEntries, null, 2)
    res.writeHead(code, { 'Content-Type': 'text/plain' })
    res.end(body)
    return
  }

  const [module, action] = rawUrl
    .replace('/api/', '')
    .split('/')
    .filter(a => a)

  let lambda = lambdas[module]

  if (is.objectNative(lambda) && action) {
    lambda = lambda[action]
  }

  if (is.function(lambda)) {
    /** @type {Buffer[]} */
    const chunks = []
    req.body = chunks

    req.on('data', chunk => {
      if (is.string(chunk)) {
        chunk = Buffer.from(chunk)
      }

      chunks.push(/** @type {Buffer} */ (chunk))
    })

    req.on('end', async () => {
      req.body = Buffer.concat(chunks).toString()

      if (req.headers['content-type'] === 'application/json') {
        try {
          req.body = JSON.parse(/** @type {string} */ (req.body))
        } catch (e) {
          log.error('E_JSON_PARSE', e)
          req.body = e
        }
      }

      const result = /** @type {{ code?: number, body?: string, type?: string }} */ (
        await lambda(req, res)
      )
      const { code = 500, body = 'Internal Server Error', type = 'text/plain' } = result

      res.writeHead(code, { 'Content-Type': type })
      res.end(body)
    })

    return true
  }

  return false
}
