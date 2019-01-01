const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const zip = require('node-zopfli-es')

const { mkdirp } = require('../lib')

const isProd = process.env.NODE_ENV === 'production'

const write = () => {
  const { css, lib, pages, static } = global.app
  // write static first to make sure all other files below get written
  // even if there is a name clash
  Object.entries(static).forEach(([name, content]) => {
    mkdirp(config.DIR.TMP)
    fs.writeFileSync(path.join(config.DIR.TMP, name), content)
  })

  pages.forEach(page => {
    const dir = path.dirname(page.path)
    mkdirp(dir)
    fs.writeFileSync(page.path, page.rendered)
  })

  fs.writeFileSync(path.join(config.DIR.TMP, 'magic.js'), lib.bundle.code)

  fs.writeFileSync(path.join(config.DIR.TMP, 'magic.css'), isProd ? css.css : css.minified)

  const minTempFile = path.join(config.DIR.TMP, 'magic.min.js')
  fs.writeFileSync(minTempFile, lib.minified.code)

  if (isProd) {
    const zipped = zip.gzipSync(lib.minified.code)
    fs.writeFileSync(`${minTempFile}.gz`, zipped)
  }
}

module.exports = write
