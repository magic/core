import path from 'path'

import log from '@magic/log'
import deep from '@magic/deep'
import is from '@magic/types'

import html from './html.mjs'
import js from './js.mjs'
import style from './css.mjs'

import { addEmbeddedCss, createHash, checkLinks, addJsFiles } from '../../lib/index.mjs'

export const transpile = async (app, config) => {
  const {
    PREPEND_CSS,
    APPEND_CSS,
    PREPEND_SCRIPTS,
    APPEND_SCRIPTS,
    ENV,
    HASH_FILE_NAME,
    INCLUDED_HASH_EXTENSIONS,
    NO_CHECK_LINKS,
    NO_CHECK_LINKS_EXIT,
    NO_CHECK_LINKS_LIST,
    WEB_ROOT: root,
    NO_CHECK_LINKS_REMOTE: noRemote,
  } = config

  const { code, serviceWorker } = await js({ app, config })
  app.client = code

  const css = await style(app.style, config.THEME_VARS)

  if (!is.empty(PREPEND_CSS)) {
    const prependStyles = PREPEND_CSS.map(addEmbeddedCss).join('\n')
    css.minified = `${prependStyles}\n${css.minified}`
    css.css = `${prependStyles}\n${css.css}`
  }

  if (!is.empty(APPEND_CSS)) {
    const appendStyles = APPEND_CSS.map(addEmbeddedCss).join('\n')
    css.minified = `${css.minified}\n${appendStyles}`
    css.css = `${css.css}\n${appendStyles}`
  }

  app.hashes = {
    '/magic.css': createHash(ENV === 'production' ? css.minified : css.css),
    '/magic.js': createHash(code),
    // 'worker.js': createHash(serviceWorker),
  }

  if (PREPEND_SCRIPTS) {
    const prependScripts = addJsFiles({ js: PREPEND_SCRIPTS, WEB_ROOT: config.WEB_ROOT })
    if (!is.empty(prependScripts)) {
      app.hashes = deep.merge(app.hashes, prependScripts)
    }
  }

  if (APPEND_SCRIPTS) {
    const appendScripts = addJsFiles({ js: APPEND_SCRIPTS, WEB_ROOT: config.WEB_ROOT })
    if (!is.empty(appendScripts)) {
      app.hashes = deep.merge(app.hashes, appendScripts)
    }
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
    const ignoredLinks = NO_CHECK_LINKS_LIST || []

    if (ENV === 'production') {
      log('Checking page links')

      const unresolvedLinks = await checkLinks({
        staticUrls,
        links,
        pages,
        noRemote,
        root,
        ignoredLinks,
        dev: config.IS_DEV,
      })

      if (unresolvedLinks.length) {
        log.error('E_BROKEN_LINKS', 'Broken Links found.')
        log('to ignore run "npm run build -- --no-check-links" or magic build --no-check-links')

        if (!NO_CHECK_LINKS_EXIT) {
          process.exit(0)
        }
      }
    } else {
      checkLinks({ staticUrls, links, pages, noRemote, ignoredLinks, root, dev: config.IS_DEV })
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
