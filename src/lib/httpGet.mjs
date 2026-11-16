import http from 'http'
import https from 'https'

/**
 * @param {string} url
 * @returns {Promise<{ statusCode?: number, headers?: import('http').IncomingHttpHeaders, data?: Buffer[], error?: Error }>}
 */
export const httpGet = url =>
  new Promise((resolve, _reject) => {
    const handler = url.startsWith('https') ? https : http

    const req = handler.get(url, res => {
      const { statusCode, headers } = res

      /** @type {Buffer[]} */
      const data = []
      res.on('data', d => {
        data.push(d)
      })

      res.on('end', () => resolve({ statusCode, headers, data }))

      res.on('error', error => resolve({ error, statusCode }))
    })

    req.on('error', error => resolve({ error }))
  })
