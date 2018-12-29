const http = require('http')

const serve = (props) => {
  // console.log({ props })
  const css = props.transpiled.style.minified
  const vendor = props.transpiled.vendor.minified
  const pages = {}
  props.transpiled.pages.forEach(page => {
    pages[page.name] = page.rendered
  })

  const app = props.transpiled.app

  const handler = (req, res) => {
    if (pages[req.url]) {
      res.writeHead(200, 'text/html')
      res.end(pages[req.url])
      return
    }

    console.log(req.url)
  }

  http.createServer(handler).listen(3000)
}

module.exports = serve
