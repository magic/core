const http = require('http')

const handler = (req, res) => {
  console.log(req, res)
}

http.createServer(handler).listen(3000)