const http = require('http')
const handler = require('./handler')

const serve = async app => {
  const handle = await handler(app)

  const server = http.createServer(handle)

  server.listen(3000, () => {
    console.log('listening to http://localhost:3000')
  })

  return server
}

module.exports = serve
