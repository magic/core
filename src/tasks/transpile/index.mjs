import path from 'path'

import html from './html.mjs'
import js from './js.mjs'
import style from './css.mjs'

import { createFileHash } from '../../lib/index.mjs'

export const transpile = async (app, config) => {
  const { code, serviceWorker } = await js(app)
  const css = await style(app.style)

  app.hashes = {
    '/magic.css': createFileHash(config.ENV === 'production' ? css.minified : css.css),
    '/magic.js': createFileHash(code),
    // 'worker.js': createFileHash(serviceWorker),
  }

  const { ADD_SCRIPTS } = config
  if (ADD_SCRIPTS) {
    await Promise.all(
      ADD_SCRIPTS.map(async src => {
        const fileContent = app.static[src]
        const fileHash = createFileHash(fileContent)
        app.hashes[src] = fileHash
      }),
    )
  }

  const pages = html(app)

  pages
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .forEach(page => {
      page.hash = createFileHash(page.rendered)
      app.hashes[page.name] = page.hash
    })

  // const ignored = config.IGNORED_STATIC

  const included = config.INCLUDED_HASH_EXTENSIONS

  if (included.length) {
    Object.entries(app.static)
      .filter(([name]) => included.includes(path.extname(name)) || included.includes(name))
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .forEach(([name, val]) => {
        app.hashes[name] = createFileHash(val)
      })
  }

  app.static[`/${config.HASH_FILE_NAME}`] = JSON.stringify(app.hashes, null, 2)

  return {
    hashes: app.hashes,
    pages,
    code,
    css,
    serviceWorker,
  }
}

export default transpile
