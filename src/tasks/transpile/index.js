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
  }

  const pages = html(app)

  hashes.pages = {}

  pages
    .sort((a, b) => a.name < b.name ? -1 : 1)
    .forEach(page => {
      page.hash = createFileHash(page.rendered)
      // app.hashes.pages[`${page.name}`] = page.hash
      hashes.pages[page.name] = page.hash
    })

  hashes.static = {}
  Object.entries(app.hashes.static).sort(([a], [b]) => a > b ? 1 : -1).forEach(([name, val]) => {
    hashes.static[name] = val
  })

  app.hashes = hashes

  app.static[`/${config.HASH_FILE_NAME}`] = JSON.stringify(app.hashes, null, 2)

  return {
    pages,
    bundle,
    css,
  }
}

module.exports = transpile
