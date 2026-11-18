import path from 'path'

import deep from '@magic/deep'
import error from '@magic/error'
import log from '@magic/log'
import is from '@magic/types'

import { addEmbeddedCss, createHash, checkLinks, addJsFiles } from '../../lib/index.mjs'
import style from './css.mjs'
import html from './html.mjs'
import js from './js.mjs'

/** @import { AppObject, Config, Hashes, ScriptSrc, PageObject } from '../../types.mjs' */

/**
 * Throws on failure. the caller (runCmd -> build) catches the error,
 * logs it once and aborts the pipeline, so a broken transpile never
 * silently becomes an undefined app.
 *
 * @param {AppObject} app
 * @param {Config} config
 * @returns {Promise<AppObject>}
 */
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
    IS_DEV,
  } = config

  const jsResult = await js({ app, config })
  if (!jsResult) {
    throw error('E_TRANSPILE', 'js() did not return a result')
  }
  const { code, serviceWorker } = jsResult
  app.client = code
  app.sw = serviceWorker

  const cssResult = await style(/** @type {unknown} */ (app.style), config.THEME_VARS)
  if (!cssResult) {
    throw error('E_TRANSPILE', 'style() did not return css')
  }
  const css = /** @type {{ css: string, minified: string }} */ (cssResult)

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

  app.css = css

  /** @type {Hashes} */
  let hashes = {
    '/magic.css': createHash(ENV === 'production' ? css.minified : css.css),
    '/magic.js': createHash(code),
    // 'worker.js': createHash(serviceWorker),
  }
  app.hashes = hashes

  if (PREPEND_SCRIPTS) {
    const prependScripts = addJsFiles({ js: PREPEND_SCRIPTS, WEB_ROOT: config.WEB_ROOT })
    if (!is.empty(prependScripts)) {
      hashes = /** @type {Hashes} */ (deep.merge(hashes, prependScripts))
      app.hashes = hashes
    }
  }

  if (APPEND_SCRIPTS) {
    const appendScripts = addJsFiles({ js: APPEND_SCRIPTS, WEB_ROOT: config.WEB_ROOT })
    if (!is.empty(appendScripts)) {
      hashes = /** @type {Hashes} */ (deep.merge(hashes, appendScripts))
      app.hashes = hashes
    }
  }

  const pages = html({ app, root: config.WEB_ROOT })

  pages
    .sort((a, b) => (String(a.name) < String(b.name) ? -1 : 1))
    .forEach(page => {
      page.hash = createHash(String(page.rendered))
      hashes[String(page.name)] = page.hash
    })

  app.pages = /** @type {PageObject[]} */ (pages)

  // const ignored = config.IGNORED_STATIC

  const included = INCLUDED_HASH_EXTENSIONS

  if (included.length) {
    Object.entries(/** @type {Record<string, unknown>} */ (app.static ?? {}))
      .filter(([name]) => included.includes(path.extname(name)) || included.includes(name))
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .forEach(([name, val]) => {
        hashes[name] = createHash(/** @type {string} */ (val))
      })
  }

  app.static = /** @type {Record<string, string>} */ (app.static ?? {})
  app.static[`/${HASH_FILE_NAME}`] = JSON.stringify(app.hashes, null, 2)

  const staticUrls = Object.keys(app.static)
  /** @type {Set<string>} */
  const linkSet = new Set(/** @type {string[]} */ (app.links ?? []))
  const links = /** @type {string[]} */ ([...linkSet])

  if (!NO_CHECK_LINKS) {
    const ignoredLinks = /** @type {string[] | undefined} */ (NO_CHECK_LINKS_LIST) || []

    if (ENV === 'production') {
      log('Checking page links')

      const unresolvedLinks = await checkLinks({
        staticUrls,
        links,
        pages,
        noRemote: /** @type {boolean | undefined} */ (noRemote),
        root,
        ignoredLinks,
        dev: /** @type {boolean} */ (IS_DEV),
      })

      if (unresolvedLinks.length) {
        log.error('E_BROKEN_LINKS', 'Broken Links found.')
        log('to ignore run "npm run build -- --no-check-links" or magic build --no-check-links')

        if (!NO_CHECK_LINKS_EXIT) {
          process.exit(0)
        }
      }
    } else {
      checkLinks({
        staticUrls,
        links,
        pages,
        noRemote: /** @type {boolean | undefined} */ (noRemote),
        ignoredLinks,
        root,
        dev: /** @type {boolean} */ (IS_DEV),
      })
    }
  }

  return app
}

export default transpile
