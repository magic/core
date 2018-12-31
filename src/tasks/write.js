const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const zip = require('node-zopfli-es')

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

  fs.writeFileSync(path.join(config.DIR.TMP, 'magic.js'), vendor.bundle.code)
  const minTempFile = path.join(config.DIR.TMP, 'magic.min.js')
  fs.writeFileSync(minTempFile, vendor.minified.code)
  fs.writeFileSync(path.join(config.DIR.TMP, 'magic.css'), style.minified)

  if (process.env.NODE_ENV === 'production') {
    const zipped = zip.gzipSync(vendor.minified.code)
    fs.writeFileSync(`${minTempFile}.gz`, zipped)
  }
}

module.exports = write
