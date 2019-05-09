const path = require('path')

const is = require('@magic/types')

const html = require('./html')
const client = require('./client')
const style = require('./css')
const { writeFile, createFileHash } = require('../../lib')

const transpile = async app => {
  const bundle = await client(app.client)
  const css = await style(app.style)

  const { HASH_FILE_NAME } = config.HASH_FILE_NAME
  try {
    app.oldHashes = require(path.join(config.DIR.PUBLIC, HASH_FILE_NAME))
  } catch (e) {
    // we are happy without hashes to allow silent upgrade.
  }

  app.hashes = {
    js: createFileHash(bundle),
    css: createFileHash(config.ENV === 'production' ? css.minified : css.css),
    pages: {},
  }

  const pages = html(app)

  pages.forEach(page => {
    page.hash = createFileHash(page.rendered)
    app.hashes.pages[`https://${config.URL}${page.name}`] = page.hash
  })

  if (!is.deep.equal(app.hashes, app.oldHashes)) {
    const jsonContent = JSON.stringify(app.hashes, null, 2)
    await writeFile([`/${HASH_FILE_NAME}`, jsonContent])
  }

  return {
    pages,
    bundle,
    css,
  }
}

module.exports = transpile
