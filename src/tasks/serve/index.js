const http = require('http')
const handler = require('./handler')

const serve = app => {
  http
    .createServer(handler(app))
    .listen(3000, () => {
      console.log('listening to http://localhost:3000')
    })
}

module.exports = serve
