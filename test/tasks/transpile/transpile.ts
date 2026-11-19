import { h } from '@magic/hyperapp'
import { is } from '@magic/test'
/** @import { AppObject, Config, ModuleView, PageObject, Hashes } from '../../../src/types.mjs' */

import html from '../../../src/tasks/transpile/html.mjs'
import { transpile } from '../../../src/tasks/transpile/index.mjs'
import js from '../../../src/tasks/transpile/js.mjs'

// tests that need specific static files mutate globalThis.app,
// serialize them with a promise chain
let chain = Promise.resolve()
/** @param {() => Promise<unknown>} fn */
const lock = fn => {
  const run = chain.then(fn, fn)
  chain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

/** @param {Record<string, unknown>} [over] */
const makeApp = over =>
  /** @type {AppObject} */ ({
    client: 'const __MAGIC__ = () => { const x = 1; return x; };\n__MAGIC__();\n',
    style: [['a', { color: 'red' }]],
    View:
      (/** @type {PageObject} */ page, /** @type {Hashes} */ hashes) =>
      (/** @type {any} */ state) => [
        h('html', { lang: 'en' }, [page.View ? page.View(/** @type {any} */ state) : null]),
      ],
    pages: [
      {
        name: '/core/',
        state: {},
        View: /** @type {ModuleView} */ (() => h('div', {}, ['hello-page'])),
      },
    ],
    static: {},
    links: [],
    modules: {},
    ...over,
  })

/** @returns {Config} */
const makeConfig = /** @param {Record<string, unknown>} [over] */ over =>
  /** @type {Config} */ ({
    ENV: 'development',
    IS_DEV: true,
    IS_PROD: false,
    CLIENT_LIB_NAME: 'magic',
    WEB_ROOT: '/core/',
    HASH_FILE_NAME: 'sri-hashes.json',
    INCLUDED_HASH_EXTENSIONS: [],
    PREPEND_CSS: [],
    APPEND_CSS: [],
    PREPEND_SCRIPTS: [],
    APPEND_SCRIPTS: [],
    PREPEND_JS: [],
    APPEND_JS: [],
    PREPEND_TAGS: [],
    APPEND_TAGS: [],
    THEME: [],
    FILETYPES: { ZIPPABLE: [], IMAGES: [] },
    IGNORED_STATIC: [],
    TMP_DIR: '/tmp',
    HOIST: [],
    NO_CHECK_LINKS: true,
    THEME_VARS: {},
    CONFIG_FILE_PATH: '/test/magic.mjs',
    ROOT: '/test',
    DIR: {
      PAGES: '/test/pages',
      PUBLIC: '/test/public',
      API: '/test/api',
      ASSETS: '/test/assets',
      MODULES: '/test/modules',
      STATIC: '/test/static',
      THEMES: '/test/themes',
      LIB: ['/test/lib'],
    },
    NODE_MODULES: '/test/node_modules',
    CLIENT_SERVICE_WORKER_NAME: 'sw.js',
    HOST: 'localhost',
    PORT: 3000,
    URL: false,
    CNAME: false,
    ROBOTS_TXT: false,
    SITEMAP: false,
    HASHES: {},
    ...over,
  })

export default [
  {
    fn: async () => {
      const app = makeApp()
      const result = await transpile(app, makeConfig())
      if (!result) {
        return false
      }
      const page = /** @type {any} */ (result.pages)[0]
      const hashes = /** @type {Hashes} */ (result.hashes)
      return (
        is.str(result.client) &&
        is.str(/** @type {any} */ (result.css).css) &&
        /** @type {any} */ (result.css).css.includes('a { color: red; }') &&
        is.str(hashes['/magic.js']) &&
        is.str(hashes['/magic.css']) &&
        is.str(hashes['/core/']) &&
        is.str(/** @type {any} */ (result.static)['/sri-hashes.json']) &&
        is.str(page.rendered) &&
        page.rendered.includes('hello-page') &&
        is.str(page.hash)
      )
    },
    expect: true,
    info: 'transpile renders pages, hashes and writes sri hashes file',
  },
  {
    fn: async () => {
      const app = makeApp({
        pages: [
          {
            name: '/core/b/',
            state: {},
            View: () => h('div', {}, ['b']),
          },
          {
            name: '/core/a/',
            state: {},
            View: () => h('div', {}, ['a']),
          },
        ],
      })
      const result = await transpile(app, makeConfig())
      const names = /** @type {any[]} */ (result?.pages ?? []).map(p => p.name)
      return JSON.stringify(names) === JSON.stringify(['/core/a/', '/core/b/'])
    },
    expect: true,
    info: 'transpile sorts pages by name',
  },
  {
    fn: async () => {
      const app = makeApp({ static: { '/data.txt': 'file-content' } })
      const result = await transpile(app, makeConfig({ INCLUDED_HASH_EXTENSIONS: ['.txt'] }))
      const hashes = /** @type {Record<string, string>} */ (result?.hashes ?? {})
      return is.str(hashes['/data.txt'])
    },
    expect: true,
    info: 'transpile hashes static files with included extensions',
  },
  {
    fn: async () => {
      const app = makeApp({ client: 'not ( valid js' })
      try {
        await transpile(app, makeConfig())
        return false
      } catch (e) {
        // transpile rethrows, runCmd catches and returns the error,
        // so a broken client never silently becomes an undefined app
        return is.error(e)
      }
    },
    expect: true,
    info: 'transpile throws when the client code cannot be parsed',
  },
  {
    fn: async () => {
      const app = makeApp()
      app.links = ['/core/broken/']
      // production, remote checks disabled, exit on broken links disabled
      const result = await transpile(
        app,
        makeConfig({
          ENV: 'production',
          IS_DEV: false,
          IS_PROD: true,
          NO_CHECK_LINKS: false,
          NO_CHECK_LINKS_REMOTE: true,
          NO_CHECK_LINKS_EXIT: true,
        }),
      )
      return result === app
    },
    expect: true,
    info: 'transpile reports broken links but continues with NO_CHECK_LINKS_EXIT',
  },
  {
    fn: async () => {
      const app = makeApp()
      app.links = []
      const result = await transpile(
        app,
        makeConfig({
          ENV: 'production',
          IS_DEV: false,
          IS_PROD: true,
          NO_CHECK_LINKS: false,
          NO_CHECK_LINKS_REMOTE: true,
        }),
      )
      return result === app
    },
    expect: true,
    info: 'transpile checks links in production without broken links',
  },
  {
    fn: async () =>
      lock(async () => {
        /** @type {any} */
        const gt = globalThis
        const prevApp = gt.app
        gt.app = {
          static: {
            '/core/pre.css': 'pre{color:red}',
            '/core/post.css': 'post{color:blue}',
            '/vendor.js': 'var v = 1;',
          },
        }
        try {
          const app = makeApp()
          const result = await transpile(
            app,
            makeConfig({
              PREPEND_CSS: ['/core/pre.css'],
              APPEND_CSS: ['/core/post.css'],
              PREPEND_SCRIPTS: [{ src: '/core/vendor.js' }],
              APPEND_SCRIPTS: [],
            }),
          )
          const css = /** @type {any} */ (result?.css)
          const hashes = /** @type {Record<string, string>} */ (result?.hashes ?? {})
          return (
            css.css.startsWith('pre{color:red}') &&
            css.css.endsWith('post{color:blue}') &&
            is.str(hashes['vendor.js'])
          )
        } finally {
          gt.app = prevApp
        }
      }),
    expect: true,
    info: 'transpile prepends and appends css and hashes prepend scripts',
  },
  // ---- html.mjs
  {
    fn: async () => {
      const app = makeApp()
      app.hashes = {}
      const pages = html({ app, root: '/core/' })
      const page = /** @type {any} */ (pages)[0]
      return (
        is.arr(pages) &&
        is.str(page.rendered) &&
        page.rendered.includes('hello-page') &&
        /** @type {any} */ (app).state.root === '/core/' &&
        /** @type {any} */ (app).state.url === '/core/'
      )
    },
    expect: true,
    info: 'html renders pages and sets state url and root',
  },
  {
    fn: async () => {
      const app = makeApp({
        pages: [
          {
            name: '/core/link/',
            state: {},
            View: () => h('a', { href: '/target/' }),
          },
        ],
      })
      app.hashes = {}
      const pages = html({ app, root: '/core/' })
      const rendered = /** @type {string} */ (/** @type {any} */ (pages)[0].rendered)
      return rendered.includes('href="/core/target/"')
    },
    expect: true,
    info: 'html rewrites local hrefs to include the web root',
  },
  {
    fn: async () => {
      const app = makeApp({
        pages: [
          {
            name: '/core/img/',
            state: {},
            View: () => h('img', { src: '/logo.png' }),
          },
        ],
      })
      app.hashes = {}
      const pages = html({ app, root: '/core/' })
      const rendered = /** @type {string} */ (/** @type {any} */ (pages)[0].rendered)
      return rendered.includes('src="/core/logo.png"')
    },
    expect: true,
    info: 'html rewrites local srcs to include the web root',
  },
  // ---- js.mjs
  {
    fn: async () => {
      const result = await js({
        app: makeApp(),
        config: makeConfig(),
      })
      return is.obj(result) && is.str(/** @type {any} */ (result).code)
    },
    expect: true,
    info: 'js transforms the client code',
  },
  {
    fn: async () => {
      const result = await js({
        app: makeApp({ client: 'not ( valid js' }),
        config: makeConfig(),
      })
      return result === undefined
    },
    expect: true,
    info: 'js returns undefined when the code cannot be transformed',
  },
  {
    fn: async () => {
      const result = await js({
        app: makeApp({ client: undefined }),
        config: makeConfig(),
      })
      // undefined code returns a minimal valid client
      return is.obj(result) && /** @type {any} */ (result).code.includes('__MAGIC__')
    },
    expect: true,
    info: 'js returns a minimal client when no code is given',
  },
]
