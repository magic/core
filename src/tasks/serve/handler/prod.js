const URL = require('url')

const { getFiles, getContentType, fs } = require('../../../lib')

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
  const publicFiles = await maybeGetFiles(config.DIR.PUBLIC)
  const apiFiles = await maybeGetFiles(config.DIR.API)

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

  const lambdas = {}
  if (apiFiles.length) {
    apiFiles.forEach(name => {
      const rootName = name.replace(config.DIR.API, '').replace('.js', '/')
      lambdas[rootName] = require(name)
    })
  }
  const hasApi = Object.keys(static).length > 0

  return async (req, res) => {
    const url = URL.parse(req.url)
    let { pathname } = url

    const { WEB_ROOT = '/' } = config
    const Location = WEB_ROOT

    if (!pathname.startsWith(WEB_ROOT)) {
      res.writeHead(302, { Location })
      res.end()
      return
    } else {
      pathname = pathname.replace(WEB_ROOT, '/')
    }

    if (config.FOR_DEATH_CAN_NOT_HAVE_HIM) {
      res.setHeader('X-Clacks-Overhead', 'GNU Terry Pratchet')
    }

    if (hasStatic) {
      let name
      if (static[pathname]) {
        name = pathname
      } else if (static[`${pathname}index.html`]) {
        name = `${pathname}index.html`
      }

      const headers = {
        'content-type': getContentType(name),
      }

      if (static[`${name}.gz`]) {
        if (req.headers['accept-encoding'].includes('gzip')) {
          name = `${name}.gz`
          headers['content-encoding'] = 'gzip'
        }
      }

      const content = static[name]
      if (content) {
        res.writeHead(200, headers)
        res.end(content)
        return
      }
    }

    if (req.method === 'POST') {
      if (hasApi && pathname.startsWith('/api')) {
        const action = pathname.replace('/api', '')
        if (typeof lambdas[action] === 'function') {
          return await lambdas[action](req, res)
        }
      }
    }


    res.writeHead(302, { Location: WEB_ROOT })
    res.end()
  }
}

module.exports = handler
