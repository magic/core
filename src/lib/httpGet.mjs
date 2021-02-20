import http from 'http'
import https from 'https'

export const httpGet = url =>
  new Promise((resolve, reject) => {
    const handler = url.startsWith('https') ? https : http

    const req = handler.get(url, res => {
      // console.log('statusCode:', res.statusCode);

      const data = []
      res.on('data', d => {
        data.push(d)
      })

      res.on('end', () => resolve({ statusCode: res.statusCode, data }))
    })

    req.on('error', reject)
  })
