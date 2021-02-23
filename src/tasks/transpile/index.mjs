import path from 'path'

import log from '@magic/log'

import html from './html.mjs'
import js from './js.mjs'
import style from './css.mjs'

import { createFileHash, checkLinks } from '../../lib/index.mjs'

export const transpile = async (app, config) => {
  const {
    ADD_SCRIPTS,
    ENV,
    HASH_FILE_NAME,
    INCLUDED_HASH_EXTENSIONS,
    NO_CHECK_LINKS,
    NO_CHECK_LINKS_EXIT,
  } = config

  const { code, serviceWorker } = await js(app, config)
  app.client = code

  const css = await style(app.style, config.THEME_VARS)

  app.hashes = {
    '/magic.css': createFileHash(ENV === 'production' ? css.minified : css.css),
    '/magic.js': createFileHash(code),
    // 'worker.js': createFileHash(serviceWorker),
  }

  if (ADD_SCRIPTS) {
    await Promise.all(
      ADD_SCRIPTS.map(async src => {
        const fileContent = app.static[src]
        const fileHash = createFileHash(fileContent)
        app.hashes[src] = fileHash
      }),
    )
  }

  const pages = html(app, config)

  pages
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .forEach(page => {
      page.hash = createFileHash(page.rendered)
      app.hashes[page.name] = page.hash
    })

  // const ignored = config.IGNORED_STATIC

  const included = INCLUDED_HASH_EXTENSIONS

  if (included.length) {
    Object.entries(app.static)
      .filter(([name]) => included.includes(path.extname(name)) || included.includes(name))
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .forEach(([name, val]) => {
        app.hashes[name] = createFileHash(val)
      })
  }
  app.static[`/${HASH_FILE_NAME}`] = JSON.stringify(app.hashes, null, 2)

  if (!NO_CHECK_LINKS) {
    if (ENV === 'production') {
      log('Checking page links')
      const unresolvedLinks = await checkLinks(app, pages)
      if (unresolvedLinks.length) {
        log.error('E_BROKEN_LINKS', 'Broken Links found.')

        if (!NO_CHECK_LINKS_EXIT) {
          process.exit(0)
        }
      }
    } else {
      const staticUrls = Object.keys(app.static)
      const links = Array.from(new Set(app.links))

      const { NO_CHECK_LINKS_REMOTE: noRemote, ROOT: root } = config

      checkLinks({ staticUrls, links, pages, noRemote, root })
    }
  }

  return {
    hashes: app.hashes,
    pages,
    code,
    css,
    serviceWorker,
  }
}

export default transpile
