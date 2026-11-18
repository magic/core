import { h } from '@magic/hyperapp'
import { is } from '@magic/test'

import html from '../../../src/tasks/transpile/html.mjs'
import { transpile } from '../../../src/tasks/transpile/index.mjs'

/** @param {Record<string, unknown>} [over] */
const makeApp = over => ({
  client: 'const __MAGIC__ = () => { const x = 1; return x; };\n__MAGIC__();\n',
  style: [['a', { color: 'red' }]],
  /** @type {any} */
  View: page => /** @type {any} */ state => [
    h('html', { lang: 'en' }, [page.View ? page.View(state) : null]),
  ],
  pages: [
    {
      name: '/core/',
      state: {},
      View: () => h('div', {}, ['hello-page']),
    },
  ],
  static: {},
  links: [],
  modules: {},
  ...over,
})

/** @param {Record<string, unknown>} [over] */
const makeConfig = over => ({
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
  NO_CHECK_LINKS: true,
  THEME_VARS: {},
  ...over,
})

/**
 * patch process.exit so it records the exit code instead of killing the runner.
 * a throwing patch would take down the whole test worker when the runner's
 * own process-level error handler calls process.exit.
 * @returns {() => number | undefined}
 */
const patchExit = () => {
  const orig = process.exit
  /** @type {number | undefined} */
  let code
  process.exit = newCode => {
    code = newCode
  }
  return () => {
    process.exit = orig
    return code
  }
}

export default [
  {
    fn: () => {
      // urls that do not start with WEB_ROOT get prefixed with it
      /** @type {any} */
      const app = {
        state: {},
        View: () => /** @type {any} */ () => [h('a', { href: '/unrooted' }, ['x'])],
        pages: [
          {
            name: '/core/x/',
            state: {},
            View: () => h('a', { href: '/unrooted' }, ['x']),
          },
        ],
        hashes: {},
      }
      const pages = html({ app, root: '/core/' })
      return pages[0].rendered.includes('href="/core/unrooted"')
    },
    expect: true,
    info: 'html prefixes unrooted hrefs with WEB_ROOT',
  },
  {
    fn: () => {
      // a rooted url is not touched
      /** @type {any} */
      const app = {
        state: {},
        View: () => /** @type {any} */ () => [h('a', { href: '/core/kept' }, ['x'])],
        pages: [
          {
            name: '/core/x/',
            state: {},
            View: () => h('a', { href: '/core/kept' }, ['x']),
          },
        ],
        hashes: {},
      }
      const pages = html({ app, root: '/core/' })
      return (
        pages[0].rendered.includes('href="/core/kept"') &&
        !pages[0].rendered.includes('/core/core/')
      )
    },
    expect: true,
    info: 'html leaves rooted hrefs alone',
  },
  {
    fn: () => {
      // a view that throws during render exits the process
      /** @type {any} */
      const app = {
        state: {},
        View: () => /** @type {any} */ () => {
          throw new Error('render boom')
        },
        pages: [
          {
            name: '/core/x/',
            state: {},
            View: () => {
              throw new Error('render boom')
            },
          },
        ],
        hashes: {},
      }
      const unpatch = patchExit()
      try {
        const pages = html({ app, root: '/core/' })
        // the exit is a recorded no-op, so the failing page map callback
        // falls through and returns undefined
        return pages[0] === undefined && unpatch() === 1
      } finally {
        if (unpatch() === undefined) {
          unpatch()
        }
      }
    },
    expect: true,
    info: 'html exits with code 1 when a page fails to render',
  },
  {
    fn: async () => {
      // production build with a broken local link exits with code 0
      const app = makeApp({
        links: ['/core/missing-page'],
        pages: [
          {
            name: '/core/',
            state: {},
            View: () => h('a', { href: '/core/missing-page' }, ['x']),
          },
        ],
      })
      const unpatch = patchExit()
      try {
        const result = await transpile(
          app,
          makeConfig({
            ENV: 'production',
            IS_DEV: false,
            IS_PROD: true,
            NO_CHECK_LINKS: false,
            NO_CHECK_LINKS_EXIT: undefined,
            NO_CHECK_LINKS_LIST: [],
          }),
        )
        // the exit is a recorded no-op, so transpile continues and returns
        // the app even though it wanted to exit with code 0
        return is.str(result?.client) && unpatch() === 0
      } finally {
        if (unpatch() === undefined) {
          unpatch()
        }
      }
    },
    expect: true,
    info: 'transpile exits with code 0 on broken links in production',
  },
  {
    fn: async () => {
      // a dev build checks links without exiting
      const app = makeApp({
        pages: [
          {
            name: '/core/',
            state: {},
            View: () => h('a', { href: '/core/missing-page' }, ['x']),
          },
        ],
      })
      const unpatch = patchExit()
      try {
        const result = await transpile(
          app,
          makeConfig({
            ENV: 'development',
            IS_DEV: true,
            NO_CHECK_LINKS: false,
            NO_CHECK_LINKS_REMOTE: true,
            NO_CHECK_LINKS_LIST: [],
          }),
        )
        return is.str(result?.client)
      } finally {
        unpatch()
      }
    },
    expect: true,
    info: 'transpile checks links in dev mode without exiting',
  },
]
