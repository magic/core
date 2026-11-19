import type { AppObject, Config } from '../../../src/types.mjs'

import { rm, mkdir, writeFile, readFile, access } from 'node:fs/promises'
import path from 'path'

import { is } from '@magic/test'

import { write } from '../../../src/tasks/write/index.mjs'
import { writePages } from '../../../src/tasks/write/pages.mjs'
import { writeServer, writeLambda } from '../../../src/tasks/write/server.mjs'
import { writeStatic } from '../../../src/tasks/write/static.mjs'

const base = path.join(process.cwd(), '.test-write-tmp')

/**
 * @param {string} name
 * @returns {Promise<{ root: string, publicDir: string, apiDir: string }>}
 */
const makeTmp = async (name: string) => {
  const root = path.join(base, name)
  await rm(root, { recursive: true, force: true })
  await mkdir(root, { recursive: true })
  return {
    root,
    publicDir: path.join(root, 'public'),
    apiDir: path.join(root, 'api'),
  }
}

/** @param {string} p */
const exists = async (p: string) => {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

/**
 * @param {{ publicDir: string, apiDir: string }} tmp
 * @param {Record<string, unknown>} [over]
 * @returns {Config}
 */
const makeConfig = (
  tmp: { publicDir: string; apiDir: string },
  over: Record<string, unknown> = {},
) =>
  ({
    DIR: { PUBLIC: tmp.publicDir, API: tmp.apiDir },
    CLIENT_LIB_NAME: 'magic',
    IS_PROD: false,
    WEB_ROOT: '/core/',
    HASHES: {},
    IGNORED_STATIC: [],
    CONFIG_FILE_PATH: '/test/magic.mjs',
    ROOT: '/test',
    NODE_MODULES: '/test/node_modules',
    CLIENT_SERVICE_WORKER_NAME: 'sw.js',
    HOST: 'localhost',
    PORT: 3000,
    URL: false,
    CNAME: false,
    ROBOTS_TXT: false,
    SITEMAP: false,
    FILETYPES: { ZIPPABLE: [], IMAGES: [] },
    THEME: [],
    PREPEND_JS: [],
    APPEND_JS: [],
    PREPEND_CSS: [],
    APPEND_CSS: [],
    PREPEND_SCRIPTS: [],
    APPEND_SCRIPTS: [],
    PREPEND_TAGS: [],
    APPEND_TAGS: [],
    INCLUDED_HASH_EXTENSIONS: [],
    HOIST: [],
    TMP_DIR: '/tmp',
    ...over,
  }) as unknown as Config

const makeApp = (over?: Record<string, unknown>) =>
  ({
    css: { css: 'dev-css', minified: 'min-css' },
    client: 'client-js',
    static: {},
    pages: [],
    lambdas: {},
    View: () => () => null,
    ...over,
  }) as unknown as AppObject

export default {
  afterAll: async () => {
    await rm(base, { recursive: true, force: true })
  },
  tests: [
    {
      fn: async () => {
        const tmp = await makeTmp('pages')
        const pages = [
          { name: '/core/', path: '/core/index.html', hash: 'new', rendered: '<html>1</html>' },
          {
            name: '/core/about/',
            path: '/core/about/index.html',
            hash: 'new2',
            rendered: '<html>2</html>',
          },
        ]
        await writePages(makeApp({ pages }), makeConfig(tmp))
        const a = await readFile(path.join(tmp.publicDir, 'index.html'), 'utf8')
        const b = await readFile(path.join(tmp.publicDir, 'about', 'index.html'), 'utf8')
        return a === '<html>1</html>' && b === '<html>2</html>'
      },
      expect: true,
      info: 'writePages writes rendered pages to the public dir',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('pages-same-hash')
        const pages = [
          {
            name: '/core/same/',
            path: '/core/same/index.html',
            hash: 'old',
            rendered: 'CHANGED',
          },
        ]
        // seed an existing file, then write with the same hash: must be skipped
        const dir = path.join(tmp.publicDir, 'core', 'same')
        await mkdir(dir, { recursive: true })
        await writeFile(path.join(dir, 'index.html'), 'ORIGINAL')
        await writePages(makeApp({ pages }), makeConfig(tmp, { HASHES: { '/core/same/': 'old' } }))
        const content = await readFile(path.join(dir, 'index.html'), 'utf8')
        return content === 'ORIGINAL'
      },
      expect: true,
      info: 'writePages skips pages whose hash did not change',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('pages-no-name')
        const pages = [{ name: undefined, path: '/core/unnamed.html', hash: 'x', rendered: 'x' }]
        await writePages(makeApp({ pages }), makeConfig(tmp))
        const content = await readFile(path.join(tmp.publicDir, 'unnamed.html'), 'utf8')
        return content === 'x'
      },
      expect: true,
      info: 'writePages writes pages without a name',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('static')
        const staticFiles = {
          '/logo.png': 'png',
          '/sub/inner.txt': 'txt',
          '/ignored.md': 'md',
          '/skipped.txt': 'txt2',
        }
        await writeStatic(
          makeApp({ static: staticFiles }),
          makeConfig(tmp, { IGNORED_STATIC: ['.md', '/skipped.txt'] }),
        )
        return (
          (await readFile(path.join(tmp.publicDir, 'logo.png'), 'utf8')) === 'png' &&
          (await readFile(path.join(tmp.publicDir, 'sub', 'inner.txt'), 'utf8')) === 'txt' &&
          !(await exists(path.join(tmp.publicDir, 'ignored.md'))) &&
          !(await exists(path.join(tmp.publicDir, 'skipped.txt')))
        )
      },
      expect: true,
      info: 'writeStatic writes static files and skips ignored ones',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('static-empty')
        await writeStatic(makeApp({ static: {} }), makeConfig(tmp))
        return true
      },
      expect: true,
      info: 'writeStatic does nothing without static files',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('lambda')
        await mkdir(tmp.root, { recursive: true })
        await writeLambda([path.join(tmp.root, 'hello'), 'async () => 1'])
        const content = await readFile(path.join(tmp.root, 'hello.mjs'), 'utf8')
        return content === 'async () => 1'
      },
      expect: true,
      info: 'writeLambda writes a .mjs file',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('server')
        await writeServer(
          makeApp({ lambdas: { ping: async () => ({ code: 200, body: 'pong' }) } }),
          makeConfig(tmp),
        )
        const content = await readFile(path.join(tmp.apiDir, 'ping.mjs'), 'utf8')
        return content.startsWith('export default ')
      },
      expect: true,
      info: 'writeServer wraps lambdas as api modules',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('server-empty')
        await writeServer(makeApp({ lambdas: {} }), makeConfig(tmp))
        return true
      },
      expect: true,
      info: 'writeServer does nothing without lambdas',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('write')
        await write(
          makeApp({
            static: { '/a.txt': 'a' },
            pages: [
              { name: '/core/', path: '/core/index.html', hash: 'h', rendered: '<html></html>' },
            ],
          }),
          makeConfig(tmp),
        )
        const js = await readFile(path.join(tmp.publicDir, 'magic.js'), 'utf8')
        const css = await readFile(path.join(tmp.publicDir, 'magic.css'), 'utf8')
        const page = await readFile(path.join(tmp.publicDir, 'index.html'), 'utf8')
        const stat = await readFile(path.join(tmp.publicDir, 'a.txt'), 'utf8')
        return js === 'client-js' && css === 'dev-css' && page === '<html></html>' && stat === 'a'
      },
      expect: true,
      info: 'write writes js, css, static files and pages',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('write-prod')
        await write(makeApp(), makeConfig(tmp, { IS_PROD: true }))
        const css = await readFile(path.join(tmp.publicDir, 'magic.css'), 'utf8')
        return css === 'min-css'
      },
      expect: true,
      info: 'write uses minified css in production',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('write-split')
        await write(makeApp(), makeConfig(tmp, { SPLIT_BUNDLES: true }))
        // SPLIT_BUNDLES only warns, js/css are not written
        return !(await exists(path.join(tmp.publicDir, 'magic.js')))
      },
      expect: true,
      info: 'write skips client bundles when SPLIT_BUNDLES is set',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('write-no-css')
        // a missing css falls back to an empty object, the css write fails
        try {
          await write(makeApp({ css: undefined }), makeConfig(tmp))
          return false
        } catch (e) {
          return is.error(e)
        }
      },
      expect: true,
      info: 'write rejects when the css is missing',
    },
    {
      fn: async () => {
        const tmp = await makeTmp('write-pages-named')
        // pages without a name are always written,
        // and a missing WEB_ROOT is tolerated
        await writePages(
          makeApp({ pages: [{ path: '/x', rendered: 'unnamed' }] }),
          makeConfig({ ...tmp }, { WEB_ROOT: undefined, DIR: { PUBLIC: tmp.publicDir } }),
        )
        return exists(path.join(tmp.publicDir, 'x'))
      },
      expect: true,
      info: 'writePages writes pages without a name and without a WEB_ROOT',
    },
    {
      fn: async () => {
        // no lambdas at all is a no-op
        await writeServer(makeApp({ lambdas: undefined }), makeConfig(await makeTmp('server-none')))
        return true
      },
      expect: true,
      info: 'writeServer does nothing without lambdas',
    },
    {
      fn: async () => {
        // without DIR.API the lambdas are written to ./api in the cwd
        const apiDir = path.join(process.cwd(), 'api')
        const cwdApi = await access(apiDir).then(
          () => 'existing',
          () => 'missing',
        )
        await writeServer(makeApp({ lambdas: { mylambda: async () => 'x' } }), {
          DIR: {
            PAGES: '/tmp/pages',
            PUBLIC: '/tmp/nope',
            ASSETS: '/tmp/assets',
            MODULES: '/tmp/modules',
            STATIC: '/tmp/static',
            THEMES: '/tmp/themes',
            LIB: ['/tmp/lib'],
          },
        } as unknown as Config)
        const written = await readFile(path.join(apiDir, 'mylambda.mjs'), 'utf8')
        const ok = written.includes('export default')
        // clean up if the test created the dir
        if (cwdApi === 'missing') {
          await rm(apiDir, { recursive: true, force: true })
        } else {
          await rm(path.join(apiDir, 'mylambda.mjs'), { force: true })
        }
        return ok
      },
      expect: true,
      info: 'writeServer falls back to ./api without DIR.API',
    },
    {
      fn: async () => {
        // no static at all is a no-op
        await writeStatic(makeApp({ static: undefined }), makeConfig(await makeTmp('static-none')))
        return true
      },
      expect: true,
      info: 'writeStatic does nothing without static files',
    },
  ],
}
