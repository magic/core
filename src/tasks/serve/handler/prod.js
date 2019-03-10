const path = require('path')
const { getFiles, getContentType, fs } = require('../../../lib')

const { parse } = require('url')

const maybeGetFiles = async dir => {
  try {
    if (await fs.exists(dir)) {
      return await getFiles(dir)
    }
  } catch (e) {
    return []
  }
  return []
}

const handler = async app => {
  // only gets executed once on server start

  // first find public files, if there are any
  const publicFiles = await maybeGetFiles(config.DIR.PUBLIC)
  const static = {}
  if (publicFiles.length) {
    await Promise.all(
      publicFiles.map(async name => {
        const rootName = name.replace(config.DIR.PUBLIC, '')
        static[rootName] = await fs.readFile(name)
      }),
    )
  }
  const hasStatic = Object.keys(static).length > 0

  // find lambda files, if there are any
  const apiFiles = await maybeGetFiles(config.DIR.API)
  const lambdas = {}
  if (apiFiles.length) {
    apiFiles.forEach(name => {
      const rootName = name.replace(config.DIR.API, '').replace('.js', '/')
      lambdas[rootName] = require(name)
    })
  }
  const hasApi = Object.keys(static).length > 0

  // handle the actual request
  return async (req, res) => {
    const url = parse(req.url.replace(config.WEB_ROOT, '/'))
    const { pathname } = url

    if (config.FOR_DEATH_CAN_NOT_HAVE_HIM) {
      res.setHeader('x-clacks-overhead', 'GNU Terry Pratchet')
    }

    if (hasStatic) {
      let name
      if (static[pathname]) {
        name = pathname
      } else if (static[`${pathname}index.html`]) {
        name = `${pathname}index.html`
      }

      res.setHeader('content-type', getContentType(name))

      if (static[`${name}.gz`]) {
        if (req.headers['accept-encoding'].includes('gzip')) {
          name = `${name}.gz`
          res.setHeader('content-encoding', 'gzip')
        }
      }

      const content = static[name]
      if (content) {
        res.writeHead(200)
        res.end(content)
        return
      }
    }

    if (hasApi) {
      if (pathname.startsWith('/api')) {
        if (req.method === 'POST') {
          const action = pathname.replace('/api', '')
          if (typeof lambdas[action] === 'function') {
            return await lambdas[action](req, res)
          }
        }

        // TODO: add api docs
        // if (req.method === 'GET') {

        // }
      }
    }

    res.writeHead(404, { 'content-type': 'text/html' })
    res.end(static['/404/index.html'])
  }
}

module.exports = handler
