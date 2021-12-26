import http from 'http'
import https from 'https'

export const httpGet = url =>
  new Promise((resolve, reject) => {
    const handler = url.startsWith('https') ? https : http

    const req = handler.get(url, res => {
      const { statusCode, headers } = res

      const data = []
      res.on('data', d => {
        data.push(d)
      })

      res.on('end', () => resolve({ statusCode, headers, data }))

      res.on('error', error => resolve({ error, statusCode }))
    })

    req.on('error', error => resolve({ error }))
  })
