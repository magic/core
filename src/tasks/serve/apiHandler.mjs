import is from '@magic/types'

export const apiHandler = async (req, res, { lambdas, rawUrl }) => {
  const [module, action] = rawUrl
    .replace('/api/', '')
    .split('/')
    .filter(a => a)

  let lambda = lambdas[module]

  if (is.objectNative(lambda) && action) {
    lambda = lambda[action]
  }

  if (is.function(lambda)) {
    req.body = []

    req.on('data', chunk => {
      if (typeof chunk === 'string') {
        chunk = Buffer.from(chunk)
      }

      req.body.push(chunk)
    })

    req.on('end', async (...args) => {
      req.body = Buffer.concat(req.body).toString()

      const result = await lambda(req, res, ...args)
      const { code = 500, body = 'Internal Server Error', type = 'text/plain' } = result

      res.writeHead(code, { 'Content-Type': type })
      res.end(body)
    })

    return true
  }

  return false
}
