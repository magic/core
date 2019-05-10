const path = require('path')

const is = require('@magic/types')

const html = require('./html')
const client = require('./client')
const style = require('./css')
const { createFileHash } = require('../../lib')

const transpile = async app => {
  const bundle = await client(app.client)
  const css = await style(app.style)

  const hashes = {
    css: createFileHash(config.ENV === 'production' ? css.minified : css.css),
    js: createFileHash(bundle),
    pages: {},
    static: {},
  }

  const pages = html(app, hashes)

  pages
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .forEach(page => {
      page.hash = createFileHash(page.rendered)
      hashes.pages[page.name] = page.hash
    })

  hashes.static = {}
  Object.entries(app.static)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .forEach(([name, val]) => {
      hashes.static[name] = createFileHash(val)
    })

  app.static[`/${config.HASH_FILE_NAME}`] = JSON.stringify(hashes, null, 2)

  return {
    hashes,
    pages,
    bundle,
    css,
  }
}

module.exports = transpile
