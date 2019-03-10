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
  const publicFiles = await maybeGetFiles(config.DIR.PUBLIC)
  const apiFiles = await maybeGetFiles(config.DIR.API)

  const static = {}
  if (publicFiles.length) {
    await Promise.all(publicFiles.map(async name => {
      const rootName = name.replace(config.DIR.PUBLIC, '')
      static[rootName] = await fs.readFile(name)
    }))
  }

  const lambdas = {}
  if (apiFiles.length) {
    apiFiles.forEach(name => {
      const rootName = name.replace(config.DIR.API, '')
      lambdas[rootName] = require(name)
    })
  }

  return async (req, res) => {
    const url = parse(req.url.replace(config.WEB_ROOT, '/'))

    const tryStaticFile = url.pathname
    if (static[tryStaticFile]) {
      res.writeHead(200, getContentType(tryStaticFile))
      res.end(static[tryStaticFile])
    }

    const tryIndexHtml = `${tryStaticFile}index.html`
    if (static[tryIndexHtml]) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(static[tryIndexHtml])
      return
    }

    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end(static['/404/index.html'])
  }
}

module.exports = handler
