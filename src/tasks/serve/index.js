const http = require('http')
const util = require('util')

const handler = require('./handler')

const startServer = async server => {
  try {
    await new Promise(r => server.listen(server.options, () => r()))
    return server.options
  } catch (e) {
    server.options.port += 1
    return startServer(server)
  }
}

const serve = async app => {
  const handle = await handler(app)

  const server = http.createServer(handle)

  server.options = {
    port: config.PORT,
    host: config.HOST,
  }

  const { port, host } = await startServer(server)
  console.log(`listening to http://${host}:${port}${config.WEB_ROOT}`)

  return server
}

module.exports = serve
