import { addJsFiles } from '../../src/lib/addJsFiles.mjs'

export default [
  {
    fn: () => {
      Object.assign(globalThis, { app: { static: { '/script1.js': 'var a = 1;' } } })
      const result = addJsFiles({
        js: [{ src: 'script1.js' }],
        WEB_ROOT: '/',
      })
      return typeof result?.['script1.js'] === 'string'
    },
    expect: true,
    info: 'addJsFiles returns hashes for existing scripts',
  },
  {
    fn: () => {
      Object.assign(globalThis, { app: { static: { '/script1.js': 'var a = 1;' } } })
      const result = addJsFiles({ js: [], WEB_ROOT: '/' })
      return result === undefined
    },
    expect: true,
    info: 'addJsFiles returns undefined for empty js array',
  },
  {
    fn: () => {
      Object.assign(globalThis, { app: { static: { '/single.js': 'var s = 1;' } } })
      const result = addJsFiles({ js: { src: 'single.js' }, WEB_ROOT: '/' })
      return typeof result?.['single.js'] === 'string'
    },
    expect: true,
    info: 'addJsFiles wraps a single js object into an array',
  },
  {
    fn: () => {
      Object.assign(globalThis, { app: { static: {} } })
      try {
        addJsFiles({ js: [{ src: 'missing.js' }], WEB_ROOT: '/' })
        return false
      } catch (e) {
        return e instanceof Error && e.message.includes('could not be loaded')
      }
    },
    expect: true,
    info: 'addJsFiles throws when script content is missing',
  },
]
