import { createFileHash } from '../../lib/index.mjs'

export const prepareServiceWorker = async (app, config) => {
  const staticFiles = Object.keys(app.static)
    .filter(f => !f.endsWith('sitemap.xml') || !f.endsWith('robots.txt'))
    .map(file => `'${config.WEB_ROOT}${file}',`.replace(/\/\//g, '/'))

  const cacheFileString = `[
    '${config.WEB_ROOT}',
    '${config.WEB_ROOT}${config.CLIENT_LIB_NAME}.css',
    '${config.WEB_ROOT}${config.CLIENT_LIB_NAME}.js',
    ${staticFiles.join('')}
  ]`

  const fileHash = await createFileHash(cacheFileString)

  const serviceWorkerString = `
const cacheFiles = ${cacheFileString}

const handleCache = c => c.addAll(cacheFiles)

self.addEventListener('install', e => {
  e.waitUntil(caches.open('simple-sw-v${fileHash.split('-')[1].substr(0, 11)}').then(handleCache))
})

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)))
})
`

  return serviceWorkerString
}
