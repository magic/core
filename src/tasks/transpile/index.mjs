import path from 'path'

import log from '@magic/log'
import error from '@magic/error'

import html from './html.mjs'
import js from './js.mjs'
import style from './css.mjs'

import { createHash, checkLinks } from '../../lib/index.mjs'

export const transpile = async (app, config) => {
  const {
    ADD_SCRIPTS,
    ENV,
    HASH_FILE_NAME,
    INCLUDED_HASH_EXTENSIONS,
    NO_CHECK_LINKS,
    NO_CHECK_LINKS_EXIT,
    WEB_ROOT: root,
    NO_CHECK_LINKS_REMOTE: noRemote,
  } = config

  const { code, serviceWorker } = await js({ app, config })
  app.client = code

  const css = await style(app.style, config.THEME_VARS)

  app.hashes = {
    '/magic.css': createHash(ENV === 'production' ? css.minified : css.css),
    '/magic.js': createHash(code),
    // 'worker.js': createHash(serviceWorker),
  }

  if (ADD_SCRIPTS) {
    await Promise.all(
      ADD_SCRIPTS.map(async ({ src }) => {
        const fileContent = app.static[src]

        if (!fileContent) {
          throw error(`script ${src} could not be loaded`, 'E_ADD_SCRIPTS')
        }

        const fileHash = createHash(fileContent)
        app.hashes[src] = fileHash
      }),
    )
  }

  const pages = html({ app, root: config.WEB_ROOT })

  pages
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .forEach(page => {
      page.hash = createHash(page.rendered)
      app.hashes[page.name] = page.hash
    })

  // const ignored = config.IGNORED_STATIC

  const included = INCLUDED_HASH_EXTENSIONS

  if (included.length) {
    Object.entries(app.static)
      .filter(([name]) => included.includes(path.extname(name)) || included.includes(name))
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .forEach(([name, val]) => {
        app.hashes[name] = createHash(val)
      })
  }

  app.static[`/${HASH_FILE_NAME}`] = JSON.stringify(app.hashes, null, 2)

  const staticUrls = Object.keys(app.static)
  const links = Array.from(new Set(app.links))

  if (!NO_CHECK_LINKS) {
    if (ENV === 'production') {
      log('Checking page links')

      const unresolvedLinks = await checkLinks({ staticUrls, links, pages, noRemote, root, dev: config.IS_DEV })

      if (unresolvedLinks.length) {
        log.error('E_BROKEN_LINKS', 'Broken Links found.')

        if (!NO_CHECK_LINKS_EXIT) {
          process.exit(0)
        }
      }
    } else {
      checkLinks({ staticUrls, links, pages, noRemote, root, dev: config.IS_DEV })
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
