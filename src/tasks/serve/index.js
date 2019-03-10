const http = require('http')
const handler = require('./handler')

const serve = async app => {
  const handle = await handler(app)

  const server = http.createServer(handle)

  server.listen(3000, () => {
    let { address, port } = server.address()
    if (address === '::') {
      address = 'localhost'
    }

    console.log(`listening to ${address}:${port}`)
  })

  return server
}

module.exports = serve
