import type { AppObject, Config, ModuleProps, PageObject } from '../../../src/types.mjs'

import { h } from '@magic/hyperapp'
import { is } from '@magic/test'

import html from '../../../src/tasks/transpile/html.mjs'
import { transpile } from '../../../src/tasks/transpile/index.mjs'

const makeApp = (over?: Record<string, unknown>) =>
  ({
    client: 'const __MAGIC__ = () => { const x = 1; return x; };\n__MAGIC__();\n',
    style: [['a', { color: 'red' }]],
    View: (page: PageObject) => (state: unknown) => [
      h('html', { lang: 'en' }, [
        page.View ? page.View(state as ModuleProps) : null,
      ] as unknown as Parameters<typeof h>[2]),
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
  }) as unknown as AppObject

const makeConfig = (over?: Record<string, unknown>) =>
  ({
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
  }) as unknown as Config

const patchExit = () => {
  const orig = process.exit
  let code: number | undefined
  const proc = process as unknown as { exit: (code?: string | number | null) => void }
  proc.exit = newCode => {
    code = newCode as number | undefined
  }
  return () => {
    proc.exit = orig
    return code
  }
}

// The tests below patch the process-level global process.exit. The runner
// executes an array suite's tests in parallel, so concurrent patches would
// stomp on each other: one test's recorded exit code would land in another
// test's closure. Serialize the process.exit patching tests with a promise
// chain, the same way transpile.mjs serializes its globalThis.app mutations.
let chain: Promise<unknown> = Promise.resolve()
const lock = (fn: () => Promise<unknown>) => {
  const run = chain.then(fn, fn)
  chain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

export default [
  {
    fn: () => {
      // urls that do not start with WEB_ROOT get prefixed with it
      const app = {
        state: {},
        View: () => () => [h('a', { href: '/unrooted' }, ['x'])],
        pages: [
          {
            name: '/core/x/',
            state: {},
            View: () => h('a', { href: '/unrooted' }, ['x']),
          },
        ],
        hashes: {},
      } as unknown as AppObject
      const pages = html({ app, root: '/core/' })
      const rendered = pages[0].rendered as string
      return rendered.includes('href="/core/unrooted"')
    },
    expect: true,
    info: 'html prefixes unrooted hrefs with WEB_ROOT',
  },
  {
    fn: () => {
      // a rooted url is not touched
      const app = {
        state: {},
        View: () => () => [h('a', { href: '/core/kept' }, ['x'])],
        pages: [
          {
            name: '/core/x/',
            state: {},
            View: () => h('a', { href: '/core/kept' }, ['x']),
          },
        ],
        hashes: {},
      } as unknown as AppObject
      const pages = html({ app, root: '/core/' })
      const rendered = pages[0].rendered as string
      return rendered.includes('href="/core/kept"') && !rendered.includes('/core/core/')
    },
    expect: true,
    info: 'html leaves rooted hrefs alone',
  },
  {
    fn: async () =>
      lock(async () => {
        // a view that throws during render exits the process
        const app = {
          state: {},
          View: () => () => {
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
        } as unknown as AppObject
        const unpatch = patchExit()
        try {
          const pages = html({ app, root: '/core/' })
          // the exit is a recorded no-op, so the failing page map callback
          // falls through and returns undefined
          const first = pages[0] as PageObject | undefined
          return first === undefined && unpatch() === 1
        } finally {
          if (unpatch() === undefined) {
            unpatch()
          }
        }
      }),
    expect: true,
    info: 'html exits with code 1 when a page fails to render',
  },
  {
    fn: async () =>
      lock(async () => {
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
      }),
    expect: true,
    info: 'transpile exits with code 0 on broken links in production',
  },
  {
    fn: async () =>
      lock(async () => {
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
      }),
    expect: true,
    info: 'transpile checks links in dev mode without exiting',
  },
]
