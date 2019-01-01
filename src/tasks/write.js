const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const zip = require('node-zopfli-es')

const { mkdirp } = require('../lib')

const isProd = process.env.NODE_ENV === 'production'

const write = (app) => {
  const { css, lib, pages, static } = app
  // write static first to make sure all other files below get written
  // even if there is a name clash
  Object.entries(static).forEach(([name, content]) => {
    mkdirp(config.DIR.PUBLIC)
    fs.writeFileSync(path.join(config.DIR.PUBLIC, name), content)
  })

  pages.forEach(page => {
    const dir = path.dirname(page.path)
    mkdirp(dir)
    fs.writeFileSync(page.path, page.rendered)
  })

  const jsFile = path.join(config.DIR.PUBLIC, 'magic.js')
  fs.writeFileSync(jsFile, lib.code)

  fs.writeFileSync(path.join(config.DIR.PUBLIC, 'magic.css'), isProd ? css.css : css.minified)

  if (isProd) {
    const zipped = zip.gzipSync(lib.code)
    fs.writeFileSync(`${jsFile}.gz`, zipped)
  }
}

module.exports = write
