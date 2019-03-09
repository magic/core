const http = require('http')
const handler = require('./handler')

const serve = app => {
  const server = http.createServer(handler(app))

  server.listen(3000, () => {
    console.log('listening to http://localhost:3000')
  })

  return server
}

module.exports = serve
