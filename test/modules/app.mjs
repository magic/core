import { rm, mkdir, writeFile } from 'node:fs/promises'
import path from 'path'

import { renderToString, h } from '@magic/hyperapp'
import { is } from '@magic/test'

import { CHECK_PROPS } from '../../src/lib/CHECK_PROPS.mjs'
import App from '../../src/modules/app.mjs'
import { builtins } from '../../src/modules/index.mjs'
import { tags } from '../../src/modules/tags.mjs'
import { registerModule } from '../../src/tasks/prepare/globals/registerModule.mjs'

const base = path.join(process.cwd(), '.test-app-tmp')

/**
 * make sure the vdom tags and builtin modules are available as globals,
 * as they are registered during a real build (tasks/prepare/globals)
 */
const ensureGlobals = async () => {
  const gt = /** @type {any} */ (globalThis)
  Object.entries(builtins).forEach(([name, mod]) => {
    if (typeof gt[name] === 'undefined') {
      registerModule([name, /** @type {any} */ (mod)])
    }
  })
  Object.entries(tags).forEach(([name, tag]) => {
    if (typeof gt[name] === 'undefined') {
      gt[name] = tag
    }
  })
  if (typeof gt.lib === 'undefined') {
    const { default: isLibDefault } = await import('@magic-libraries/is')
    gt.lib = { is: isLibDefault, preventDefault: () => {} }
  }
  if (typeof gt.CHECK_PROPS === 'undefined') {
    gt.CHECK_PROPS = CHECK_PROPS
  }
  if (typeof gt.app === 'undefined') {
    gt.app = {}
  }
}

/**
 * @param {string} name
 * @returns {Promise<string>}
 */
const makeRoot = async name => {
  const root = path.join(base, name)
  await rm(root, { recursive: true, force: true })
  await mkdir(root, { recursive: true })
  return root
}

/**
 * @param {string} root
 * @param {Record<string, unknown>} [over]
 */
const makeConfig = (root, over = {}) => ({
  PREPEND_TAGS: [],
  APPEND_TAGS: [],
  PREPEND_SCRIPTS: [],
  APPEND_SCRIPTS: [],
  CLIENT_LIB_NAME: 'magic',
  DIR: { THEMES: path.join(root, 'assets', 'themes') },
  LANG: 'en',
  NODE_MODULES: '/nonexistent-magic-test/node_modules',
  ROOT: root,
  WEB_ROOT: '/core/',
  THEME: [],
  ...over,
})

const HASHES = {
  '/magic.js': 'sha384-aaaabbbbccccddddee',
  '/magic.css': 'sha384-ffffeeee111122223333',
}

/**
 * @param {any} app
 * @param {Record<string, unknown>} [pageOver]
 */
const renderView = (app, pageOver = {}) => {
  const page = {
    name: '/core/',
    state: { title: 'Page Title' },
    View: () => h('div', {}, ['page-content']),
    ...pageOver,
  }
  return renderToString(app.View(page, HASHES)({}))
}

export default {
  afterAll: async () => {
    await rm(base, { recursive: true, force: true })
  },
  basics: [
    {
      fn: async () => {
        const root = await makeRoot('empty')
        const app = await App(makeConfig(root))
        return is.fn(app.View) && app.state.url === '/core/' && app.state.root === '/core/'
      },
      expect: true,
      info: 'App returns a working app without an app file',
    },
    {
      fn: async () => {
        const root = await makeRoot('default-export')
        await writeFile(
          path.join(root, 'app.mjs'),
          `export default {
  state: { hello: 'world' },
  actions: { hi: () => 'hi' },
}
`,
        )
        const app = await App(makeConfig(root))
        return app.state.hello === 'world' && is.fn(app.actions.hi)
      },
      expect: true,
      info: 'App merges a default exported app file',
    },
    {
      fn: async () => {
        const root = await makeRoot('state-fn')
        await writeFile(
          path.join(root, 'app.mjs'),
          `export default {
  state: config => ({ fromConfig: config.WEB_ROOT }),
}
`,
        )
        const app = await App(makeConfig(root))
        return app.state.fromConfig === '/core/'
      },
      expect: true,
      info: 'App calls a function state with the config',
    },
    {
      fn: async () => {
        const root = await makeRoot('named-exports')
        await writeFile(
          path.join(root, 'app.js'),
          `export const state = config => ({ named: true, cfg: config.WEB_ROOT })
export const actions = { namedAction: () => 1 }
`,
        )
        const app = await App(makeConfig(root))
        return (
          app.state.named === true && app.state.cfg === '/core/' && is.fn(app.actions.namedAction)
        )
      },
      expect: true,
      info: 'App merges named exported app files',
    },
    {
      fn: async () => {
        const root = await makeRoot('both-files')
        await writeFile(path.join(root, 'app.js'), `export default { state: { from: 'js' } }`)
        await writeFile(path.join(root, 'app.mjs'), `export default { state: { from: 'mjs' } }`)
        const app = await App(makeConfig(root))
        return app.state.from === 'js'
      },
      expect: true,
      info: 'App prefers app.js over app.mjs',
    },
    {
      fn: async () => {
        const root = await makeRoot('seo')
        await writeFile(
          path.join(root, 'app.mjs'),
          `export default {
  state: { seo: { title: 'Seo Title Here' } },
}
`,
        )
        await ensureGlobals()
        const app = await App(makeConfig(root))
        const rendered = renderView(app)
        return rendered.includes('Seo Title Here')
      },
      expect: true,
      info: 'App extracts seo from state and renders it in the head',
    },
    {
      fn: async () => {
        const root = await makeRoot('theme')
        const themeDir = path.join(root, 'assets', 'themes', 'mytheme')
        await mkdir(themeDir, { recursive: true })
        await writeFile(
          path.join(themeDir, 'index.mjs'),
          `export const state = { themed: true }
`,
        )
        const app = await App(makeConfig(root, { THEME: 'mytheme' }))
        return app.state.themed === true
      },
      expect: true,
      info: 'App loads a local theme given as a string',
    },
    {
      fn: async () => {
        const root = await makeRoot('theme-array')
        const themeDir = path.join(root, 'assets', 'themes', 'mytheme')
        await mkdir(themeDir, { recursive: true })
        await writeFile(
          path.join(themeDir, 'index.mjs'),
          `export const state = { themed: true }
export const actions = { themeAction: () => 1 }
`,
        )
        const app = await App(makeConfig(root, { THEME: ['mytheme'] }))
        return app.state.themed === true && is.fn(app.actions.themeAction)
      },
      expect: true,
      info: 'App loads themes given as an array',
    },
    {
      fn: async () => {
        // a missing theme is skipped, the app still works
        const root = await makeRoot('missing-theme')
        const app = await App(makeConfig(root, { THEME: ['does-not-exist'] }))
        return is.fn(app.View)
      },
      expect: true,
      info: 'App tolerates missing themes',
    },
  ],
  view: [
    {
      fn: async () => {
        const root = await makeRoot('view-basic')
        await ensureGlobals()
        const app = await App(makeConfig(root))
        const rendered = renderView(app)
        return (
          rendered.includes('<!DOCTYPE html>') &&
          rendered.includes('<html') &&
          rendered.includes('lang="en"') &&
          rendered.includes('page-content') &&
          rendered.includes('magic.css') &&
          rendered.includes('magic.js')
        )
      },
      expect: true,
      info: 'App View renders doctype, head and body with magic assets',
    },
    {
      fn: async () => {
        const root = await makeRoot('view-hash')
        await ensureGlobals()
        const app = await App(makeConfig(root))
        const rendered = renderView(app)
        // short hashes are used in the asset urls
        return rendered.includes('magic.js?aaaabbbbcc') && rendered.includes('magic.css?ffffeeee11')
      },
      expect: true,
      info: 'App View uses short hashes for asset urls',
    },
    {
      fn: async () => {
        const root = await makeRoot('view-head')
        await ensureGlobals()
        const app = await App(makeConfig(root))
        const rendered = renderView(app, {
          Head: () => h('title', {}, ['custom head title']),
        })
        return rendered.includes('custom head title')
      },
      expect: true,
      info: 'App View renders page.Head when present',
    },
    {
      fn: async () => {
        const root = await makeRoot('view-tags')
        await ensureGlobals()
        const app = await App(
          makeConfig(root, {
            PREPEND_TAGS: [{ name: 'meta', props: { 'data-prepend': 'yes' } }],
            APPEND_TAGS: [{ name: 'div', props: { 'data-append': 'yes' } }],
          }),
        )
        const rendered = renderView(app)
        return rendered.includes('data-prepend') && rendered.includes('data-append')
      },
      expect: true,
      info: 'App View renders prepend and append tags',
    },
    {
      fn: async () => {
        const root = await makeRoot('view-fn-state')
        await ensureGlobals()
        const app = await App(makeConfig(root))
        // the view accepts a state function too
        const page = {
          name: '/core/',
          state: {},
          View: () => h('div', {}, ['fn-state-content']),
        }
        const rendered = renderToString(app.View(page, HASHES)(_config => ({ url: '/core/' })))
        return rendered.includes('fn-state-content')
      },
      expect: true,
      info: 'App View accepts a state function',
    },
  ],
}
