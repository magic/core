const path = require('path')

const is = require('@magic/types')

const html = require('./html')
const client = require('./client')
const style = require('./css')
const { createFileHash } = require('../../lib')

const transpile = async app => {
  const bundle = await client(app.client)
  const css = await style(app.style)

  app.hashes = {
    pages: {},
    ...app.hashes,
    js: createFileHash(bundle),
    css: createFileHash(config.ENV === 'production' ? css.minified : css.css),
  }

  const pages = html(app)

  pages.forEach(page => {
    page.hash = createFileHash(page.rendered)
    // app.hashes.pages[`${page.name}`] = page.hash
    app.hashes.pages[page.name] = page.hash
  })

  app.static[`/${config.HASH_FILE_NAME}`] = JSON.stringify(app.hashes, null, 2)

  return {
    pages,
    bundle,
    css,
  }
}

module.exports = transpile
