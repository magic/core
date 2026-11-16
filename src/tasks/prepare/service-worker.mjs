import { createHash, replaceSlashSlash } from '../../lib/index.mjs'

/** @import { AppObject } from '../../types.mjs' */

/**
 * @param {AppObject} app
 * @param {{ CLIENT_LIB_NAME: string, WEB_ROOT?: string }} config
 * @returns {Promise<string>}
 */
export const prepareServiceWorker = async (app, { CLIENT_LIB_NAME, WEB_ROOT }) => {
  const webRoot = WEB_ROOT ?? ''
  const staticFiles = Object.keys(app.static ?? {})
    .filter(f => !f.endsWith('sitemap.xml') || !f.endsWith('robots.txt'))
    .map(file => replaceSlashSlash(`'${webRoot}${file}',`))

  const cacheFileString = `[
    '${webRoot}',
    '${webRoot}${CLIENT_LIB_NAME}.css',
    '${webRoot}${CLIENT_LIB_NAME}.js',
    ${staticFiles.join('')}
  ]`

  const fileHash = await createHash(cacheFileString)

  const serviceWorkerString = `
const cacheFiles = ${cacheFileString}

const handleCache = c => c.addAll(cacheFiles)

self.addEventListener('install', e => {
  e.waitUntil(caches.open('simple-sw-v${(fileHash.split('-')[1] ?? '').substr(0, 11)}').then(handleCache))
})

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)))
})
`

  return serviceWorkerString
}
