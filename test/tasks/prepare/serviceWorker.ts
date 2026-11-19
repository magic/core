import type { AppObject } from '../../../src/types.mjs'

import { is } from '@magic/test'

import { prepareServiceWorker } from '../../../src/tasks/prepare/service-worker.mjs'

export default [
  {
    fn: async () => {
      const sw = await prepareServiceWorker(
        { static: { '/a.js': 'x', '/b.css': 'y' } } as unknown as AppObject,
        { CLIENT_LIB_NAME: 'magic', WEB_ROOT: '/core/' },
      )
      return (
        is.str(sw) &&
        sw.includes('cacheFiles') &&
        sw.includes("/core/a.js'") &&
        sw.includes("/core/b.css'") &&
        sw.includes("/core/magic.css'") &&
        sw.includes("/core/magic.js'") &&
        sw.includes("addEventListener('install'") &&
        sw.includes("addEventListener('fetch'")
      )
    },
    expect: true,
    info: 'prepareServiceWorker lists static files and core assets with web root',
  },
  {
    fn: async () => {
      const sw = await prepareServiceWorker({ static: { '/a.js': 'x' } } as unknown as AppObject, {
        CLIENT_LIB_NAME: 'magic',
      })
      return sw.includes("'/a.js'") && sw.includes("'magic.css'") && sw.includes("'magic.js'")
    },
    expect: true,
    info: 'prepareServiceWorker works without WEB_ROOT',
  },
  {
    fn: async () => {
      const sw = await prepareServiceWorker({} as unknown as AppObject, {
        CLIENT_LIB_NAME: 'magic',
        WEB_ROOT: '/',
      })
      return sw.includes('cacheFiles') && !sw.includes('/a.js')
    },
    expect: true,
    info: 'prepareServiceWorker works without static files',
  },
  {
    fn: async () => {
      const a = await prepareServiceWorker({ static: { '/a.js': 'x' } } as unknown as AppObject, {
        CLIENT_LIB_NAME: 'magic',
      })
      const b = await prepareServiceWorker({ static: { '/b.js': 'y' } } as unknown as AppObject, {
        CLIENT_LIB_NAME: 'magic',
      })
      // different cache contents must produce different cache versions
      const version = (sw: string) => sw.match(/simple-sw-v([a-z0-9]+)/)
      return (
        is.str(version(a)?.[1]) && is.str(version(b)?.[1]) && version(a)?.[1] !== version(b)?.[1]
      )
    },
    expect: true,
    info: 'prepareServiceWorker derives cache version from a content hash',
  },
]
