import path from 'path'

import html from './html.mjs'
import js from './js.mjs'
import style from './css.mjs'

import { createFileHash } from '../../lib/index.mjs'

export const transpile = async (app, config) => {
  const { bundle, serviceWorker } = await js(app)
  const css = await style(app.style)

  const hashes = {
    '/magic.css': createFileHash(config.ENV === 'production' ? css.minified : css.css),
    '/magic.js': createFileHash(bundle.code),
    // 'worker.js': createFileHash(serviceWorker.code),
  }

  const pages = html(app, hashes)

  pages
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .forEach(page => {
      page.hash = createFileHash(page.rendered)
      hashes[page.name] = page.hash
    })

  const ignored = config.IGNORED_STATIC

  const included = config.INCLUDED_HASH_EXTENSIONS

  if (included.length) {
    Object.entries(app.static)
      .filter(([name, val]) => included.includes(path.extname(name)) || included.includes(name))
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .forEach(([name, val]) => {
        hashes[name] = createFileHash(val)
      })
  }

  app.static[`/${config.HASH_FILE_NAME}`] = JSON.stringify(hashes, null, 2)

  return {
    hashes,
    pages,
    bundle,
    css,
    serviceWorker,
  }
}

export default transpile
