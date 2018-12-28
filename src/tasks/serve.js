const http = require('http')

const serve = ({ app, pages }) => {
  const handler = (req, res) => {
    console.log(req, res)
  }

  http.createServer(handler).listen(3000)
}

module.exports = serve
