const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')

const { mkdirp } = require('../lib')

const write = ({ pages, vendor, style, config }) => {
  pages.forEach(page => {
    let pagePath = path.join(config.DIR.TMP, page.name)
    mkdirp(pagePath)
    if (!pagePath.endsWith('index.js') && pagePath.endsWith('/')) {
      pagePath = path.join(pagePath, 'index.html')
    }
    fs.writeFileSync(pagePath, page.rendered)
  })

  fs.writeFileSync(path.join(config.DIR.TMP, 'vendor.js'), vendor.bundle.code)
  fs.writeFileSync(path.join(config.DIR.TMP, 'vendor.min.js'), vendor.minified.code)
  fs.writeFileSync(path.join(config.DIR.TMP, 'main.css'), style.minified)
}

module.exports = write
