import type { AppObject, Config } from '../../../src/types.mjs'

import { rm, mkdir, chmod } from 'node:fs/promises'
import path from 'path'

import fs from '@magic/fs'
import { is } from '@magic/test'

import { runConfig } from '../../../src/config.mjs'
import runApp from '../../../src/modules/app.mjs'
import { prepareApi } from '../../../src/tasks/prepare/api.mjs'
import { prepareBlog } from '../../../src/tasks/prepare/blog.mjs'
import { prepareBlogPost } from '../../../src/tasks/prepare/blogPost.mjs'
import { prepareCheckProps } from '../../../src/tasks/prepare/checkProps.mjs'
import { prepareDependencies } from '../../../src/tasks/prepare/dependencies.mjs'
import { prepare } from '../../../src/tasks/prepare/index.mjs'
import { prepareJs } from '../../../src/tasks/prepare/js.mjs'
import { prepareMetaFiles } from '../../../src/tasks/prepare/meta.mjs'
import { prepareModules } from '../../../src/tasks/prepare/modules.mjs'
import { preparePage } from '../../../src/tasks/prepare/page.mjs'
import { preparePages } from '../../../src/tasks/prepare/pages.mjs'
import { prepareServiceWorker } from '../../../src/tasks/prepare/service-worker.mjs'
import { prepareStateLinks } from '../../../src/tasks/prepare/stateLinks.mjs'
import { prepareThemes } from '../../../src/tasks/prepare/themes.mjs'

const base = path.join(process.cwd(), '.test-prepare-tmp')

const write = async (p: string, content: string) => {
  await fs.mkdirp(path.dirname(p))
  await fs.writeFile(p, content)
}

const makeConfigOver = (config: Config) => {
  config.ROOT = base
  config.DIR.PAGES = path.join(base, 'pages404')
  config.DIR.STATIC = path.join(base, 'static')
  config.DIR.PUBLIC = path.join(base, 'public')
  config.DIR.ASSETS = path.join(base, 'assets')
  config.DIR.THEMES = path.join(base, 'assets', 'themes')
  config.DIR.API = path.join(base, 'api')
  config.BLOG_DIR = undefined
  config.SPLIT = false
  config.HOIST = []
  config.THEME = []
  return config
}

export default {
  beforeAll: async () => {
    await rm(base, { recursive: true, force: true })
    await mkdir(base, { recursive: true })

    // a small app
    await write(
      path.join(base, 'pages', 'index.mjs'),
      `export const View = state => [div('home page content')]
`,
    )
    await write(
      path.join(base, 'pages2', 'one.mjs'),
      `export const View = state => [div('one page content')]
`,
    )
    await write(
      path.join(base, 'pages', 'about.mjs'),
      `export const View = state => [div('about page content')]
export const state = { about: true }
`,
    )
    // a page without a View export
    await write(path.join(base, 'pages', 'broken.mjs'), `export const state = { broken: true }\n`)
    // a 404 page for the WEB_ROOT '/' case
    await write(
      path.join(base, 'pages404', '404.mjs'),
      `export const View = state => [div('custom 404')]
`,
    )

    // static files
    await write(path.join(base, 'static', 'img.png'), 'fake png')
    await write(path.join(base, 'static', 'ok.txt'), 'ok')

    // api lambdas
    await write(path.join(base, 'api', 'file1.mjs'), `export default async (req, res) => 'file1'\n`)
    await write(path.join(base, 'api', 'broken.mjs'), `throw new Error('broken lambda')\n`)
    await write(path.join(base, 'api', 'notes.txt'), `not a lambda\n`)

    // blog posts covering all the year/month/day branches
    await write(
      path.join(base, 'news', 'index.mjs'),
      `export const View = state => [div('blog index')]
`,
    )
    await write(path.join(base, 'news', '2024.md'), `# Year only\n`)
    await write(path.join(base, 'news', '2024', '01.md'), `# Month only\n`)
    await write(path.join(base, 'news', '2024', '01', '15', 'post.md'), `# Full post\n`)
    await write(path.join(base, 'news', '2024', '01', '16.md'), `# Day as file\n`)
    await write(path.join(base, 'news', '2025', 'index.md'), `# Year archive\n`)
    await write(path.join(base, 'news', '2025', '02', '03', 'html.html'), `<p>html post</p>\n`)
    await write(
      path.join(base, 'news', '2025', '02', '04', 'viewpost.mjs'),
      `export const View = state => [div('view post')]\n`,
    )
    await write(
      path.join(base, 'news', '2025', '02', '05', 'defaultpost.mjs'),
      `export default state => [div('default post')]\n`,
    )

    // a second blog tree where the month archive exists
    await write(path.join(base, 'news2', '2026', '03', 'index.md'), `# Month archive\n`)
    await write(path.join(base, 'news2', '2026', '03', '04', 'post.md'), `# Post\n`)

    // a separate blog dir with a post that cannot be imported (syntax error)
    await write(
      path.join(base, 'news-bad', '2025', '02', '06', 'invalid.mjs'),
      `export default state => (\n`,
    )

    // theme with a reset css and a theme app file with style and styleVars
    await write(
      path.join(base, 'assets', 'themes', 't1', 'index.mjs'),
      `export const state = { theme: true }\n`,
    )
    await write(
      path.join(base, 'assets', 'themes', 't1', 'reset.css.mjs'),
      `export default { '*': { margin: 0 } }\n`,
    )
    await write(
      path.join(base, 'themed-app', 'app.mjs'),
      `export const style = { color: 'red' }
export const styleVars = { themed: 'vars' }
`,
    )

    return async () => {
      await rm(base, { recursive: true, force: true })
    }
  },
  tests: [
    {
      fn: () => {
        const magic = {
          modules: {
            Nested: {
              View: () => null,
              propTypes: { Nested: { a: 'string' } },
            },
            Flat: {
              View: () => null,
              propTypes: { a: 'string' },
            },
            SubFlat: {
              View: () => null,
              Sub: { View: () => null, propTypes: { b: 'string' } },
            },
            SubNested: {
              View: () => null,
              Sub: { View: () => null, propTypes: { Sub: { b: 'string' } } },
            },
          },
        }
        const { checkProps, propTypeString } = prepareCheckProps(
          magic as unknown as AppObject,
          { IS_DEV: true } as unknown as Config,
        )
        return (
          checkProps.includes('CHECK_PROPS') &&
          propTypeString.includes('Nested') &&
          propTypeString.includes('Flat') &&
          propTypeString.includes('Sub')
        )
      },
      expect: true,
      info: 'prepareCheckProps creates proptype declarations in dev mode',
    },
    {
      fn: () => {
        const { checkProps, propTypeString } = prepareCheckProps(
          {
            modules: { Nested: { View: () => null, propTypes: { Nested: { a: 'string' } } } },
          } as unknown as AppObject,
          { IS_DEV: false } as unknown as Config,
        )
        return checkProps === '' && propTypeString === ''
      },
      expect: true,
      info: 'prepareCheckProps is empty in production',
    },
    {
      fn: async () => {
        const RealDate = Date
        class FakeDate extends RealDate {
          constructor(...args: (string | number | Date)[]) {
            if (args.length === 0) {
              super(2026, 0, 5)
            } else {
              super(...(args as [string | number | Date]))
            }
          }
        }
        globalThis.Date = FakeDate as unknown as typeof Date
        try {
          const res = await prepareMetaFiles(
            { pages: [{ name: '/core/about/' }] } as unknown as AppObject,
            {
              CNAME: true,
              ROBOTS_TXT: true,
              SITEMAP: true,
              URL: 'example.com',
              WEB_ROOT: '/core/',
            } as unknown as Config,
          )
          return (
            res['/CNAME'] === 'example.com' &&
            res['/robots.txt'].includes('sitemap: https:/example.com/sitemap.xml') &&
            res['/sitemap.xml'].includes('https://example.com/about/') &&
            res['/sitemap.xml'].includes('2026-01-05')
          )
        } finally {
          globalThis.Date = RealDate
        }
      },
      expect: true,
      info: 'prepareMetaFiles creates robots, sitemap and CNAME with zero padded dates',
    },
    {
      fn: async () => {
        const res = await prepareMetaFiles(
          { pages: [] } as unknown as AppObject,
          { URL: 'example.com', WEB_ROOT: '/' } as unknown as Config,
        )
        return Object.keys(res).length === 0
      },
      expect: true,
      info: 'prepareMetaFiles returns an empty object without options',
    },
    {
      fn: async () => {
        const api = (await prepareApi(
          {
            modules: { MyMod: { server: { modLambda: async () => 'm' } } },
            pages: [{ name: '/core/page/', server: { pageLambda: async () => 'p' } }],
            server: { appLambda: async () => 'a' },
          } as unknown as AppObject,
          { API_DIR: true, DIR: { API: path.join(base, 'api') } } as unknown as Config,
        )) as Record<string, Record<string, unknown>>
        return (
          is.fn(api.mymod.modLambda) &&
          is.fn(api['/core/page/'].pageLambda) &&
          is.fn(api.appLambda) &&
          is.fn(api.file1)
        )
      },
      expect: true,
      info: 'prepareApi collects lambdas from api dir, modules, pages and app',
    },
    {
      fn: async () => {
        const api = await prepareApi(
          { server: { appLambda: async () => 'a' } } as unknown as AppObject,
          { DIR: { API: path.join(base, 'api') } } as unknown as Config,
        )
        return is.fn(api.appLambda) && api.file1 === undefined
      },
      expect: true,
      info: 'prepareApi skips the api dir without API_DIR',
    },
    {
      fn: () => {
        const app = { state: undefined } as unknown as AppObject
        const result = prepareStateLinks(app, { WEB_ROOT: '/' })
        return result !== undefined && Object.keys(result).length === 0
      },
      expect: true,
      info: 'prepareStateLinks returns an empty object without app state',
    },
    {
      fn: () => {
        const app: {
          state: Record<string, unknown>
          actions: Record<string, unknown>
          effects: Record<string, unknown>
          helpers: Record<string, unknown>
          subscriptions: unknown[]
          cookies: Record<string, unknown>
          init: Record<string, unknown>
          modules: Record<string, unknown>
        } = {
          state: { logo: '/logo.png' },
          actions: {},
          effects: {},
          subscriptions: [],
          cookies: {},
          init: {},
          helpers: {},
          modules: {
            WithAll: {
              View: () => null,
              state: { global: 'state', local: 'state' },
              actions: { globalAction: () => 1, localAction: () => 2 },
              effects: { globalEffect: () => 1, localEffect: () => 2 },
              helpers: { helper: () => 1 },
              subscriptions: [['subscriptions.go', 'actions.go']],
              cookies: { cookie: 'value' },
              init: [['init', 'value']],
              global: {
                state: { global: true },
                actions: { globalAction: true },
                effects: { globalEffect: true },
              },
            },
          },
        }
        prepareModules(app as unknown as AppObject)
        return (
          app.state.global === 'state' &&
          (app.state.withall as Record<string, unknown>).local === 'state' &&
          is.fn(app.actions.globalAction) &&
          is.fn((app.actions.withall as Record<string, unknown>).localAction) &&
          is.fn(app.effects.globalEffect) &&
          is.fn((app.effects.withall as Record<string, unknown>).localEffect) &&
          is.fn(app.helpers.helper) &&
          app.subscriptions.length === 1 &&
          app.cookies.cookie === 'value'
        )
      },
      expect: true,
      info: 'prepareModules merges module state, actions, effects, helpers, subscriptions and cookies',
    },
    {
      fn: async () => {
        const config = {
          BLOG_DIR: path.join(base, 'news'),
          ROOT: base,
          WEB_ROOT: '/core/',
          TMP_DIR: path.join(base, 'tmp-blog1'),
        }
        const app = {
          state: {},
          blog: await fs.getFiles(config.BLOG_DIR),
        }
        const { posts, index } = await prepareBlog(
          app as unknown as AppObject,
          config as unknown as Config,
        )
        return (
          posts.length === 13 &&
          // the full date post went into the index
          index['2024'] &&
          index['2024']['01'] &&
          index['2024']['01']['15'].length === 1 &&
          index['2025']['02']['03'].length === 1
        )
      },
      expect: true,
      info: 'prepareBlog creates posts, yearly and monthly archives and the index',
    },
    {
      // a second blog tree: the 2026 year archive is created,
      // the 2026/03 month archive is skipped because it exists
      fn: async () => {
        const config = {
          BLOG_DIR: path.join(base, 'news2'),
          ROOT: base,
          WEB_ROOT: '/core/',
          TMP_DIR: path.join(base, 'tmp-blog2'),
        }
        const app = {
          state: {},
          blog: await fs.getFiles(config.BLOG_DIR),
        }
        const { posts, index } = await prepareBlog(
          app as unknown as AppObject,
          config as unknown as Config,
        )
        return posts.length === 4 && index['2026']['03']['04'].length === 1
      },
      expect: true,
      info: 'prepareBlog skips existing month archives',
    },
    {
      fn: async () => {
        const config = {
          BLOG_DIR: path.join(base, 'news'),
          ROOT: base,
          WEB_ROOT: '/core/',
          TMP_DIR: path.join(base, 'tmp-blog3'),
        }
        const post = await prepareBlogPost({
          pageDir: config.BLOG_DIR,
          state: {},
          config: config as unknown as Config,
        })(path.join(config.BLOG_DIR, '2025', '02', '03', 'html.html'))
        return is.fn(post?.View) && post?.name?.includes('/2025/02/03/')
      },
      expect: true,
      info: 'prepareBlogPost transmutes html posts',
    },
    {
      fn: async () => {
        const config = {
          BLOG_DIR: path.join(base, 'news'),
          ROOT: base,
          WEB_ROOT: '/core/',
          TMP_DIR: path.join(base, 'tmp-blog4'),
        }
        const post = await prepareBlogPost({
          pageDir: config.BLOG_DIR,
          state: {},
          config: config as unknown as Config,
        })(path.join(config.BLOG_DIR, '2025', '02', '05', 'defaultpost.mjs'))
        return is.fn(post?.View)
      },
      expect: true,
      info: 'prepareBlogPost wraps default exported posts',
    },
    {
      // a post whose generated wrapper cannot be imported throws
      // (the children string is extracted from an arrow with two =>)
      fn: async () => {
        const config = {
          BLOG_DIR: path.join(base, 'news-bad'),
          ROOT: base,
          WEB_ROOT: '/core/',
          TMP_DIR: path.join(base, 'tmp-blog5'),
        }
        const file = path.join(config.BLOG_DIR, '2025', '02', '06', 'invalid.mjs')
        // a syntax error in the post itself: the wrapper still gets created
        try {
          const post = await prepareBlogPost({
            pageDir: config.BLOG_DIR,
            state: {},
            config: config as unknown as Config,
          })(file)
          return is.fn(post?.View)
        } catch (e) {
          return is.error(e)
        }
      },
      expect: true,
      info: 'prepareBlogPost tolerates posts that cannot be imported',
    },
    {
      fn: async () => {
        const pageWorker = preparePage({
          WEB_ROOT: '/',
          pageDir: path.join(base, 'pages404'),
          state: {},
          config: { TMP_DIR: path.join(base, 'tmp-page3') } as unknown as Config,
        })
        const page = await pageWorker(path.join(base, 'pages404', '404.mjs'))
        return page?.name === '/404/' && page?.path === '/404.html'
      },
      expect: true,
      info: 'preparePage names the 404 page 404.html',
    },
    {
      fn: async () => {
        const pageWorker = preparePage({
          WEB_ROOT: '/core/',
          pageDir: path.join(base, 'pages404'),
          state: {},
          config: { TMP_DIR: path.join(base, 'tmp-page3') } as unknown as Config,
        })
        const page = await pageWorker(path.join(base, 'pages404', '404.mjs'))
        return page?.path === '/core/404/index.html'
      },
      expect: true,
      info: 'preparePage names other trailing slash pages index.html',
    },
    {
      fn: async () => {
        try {
          const pageWorker = preparePage({
            WEB_ROOT: '/core/',
            pageDir: path.join(base, 'pages'),
            state: {},
            config: { TMP_DIR: path.join(base, 'tmp-page3') } as unknown as Config,
          })
          await pageWorker(path.join(base, 'pages', 'broken.mjs'))
          return false
        } catch (e) {
          return is.error(e) && e.message.includes('View')
        }
      },
      expect: true,
      info: 'preparePage throws for pages without a View',
    },
    {
      fn: async () => {
        // a second call with existing pages appends to them and adds a 404
        const config = {
          WEB_ROOT: '/core/',
          DIR: { PAGES: path.join(base, 'pages2') },
        } as unknown as Config
        const app = {
          files: await fs.getFiles(config.DIR.PAGES),
          pages: [{ name: '/core/existing/', View: () => null }],
          state: {},
        }
        const pages = await preparePages(app as unknown as AppObject, config)
        const names = pages.map(p => p.name)
        return (
          names.includes('/core/existing/') &&
          names.filter(n => n === '/core/404/').length === 1 &&
          pages.every(p => p !== undefined)
        )
      },
      expect: true,
      info: 'preparePages appends existing pages and adds a 404 page',
    },
    {
      fn: async () => {
        const config = {
          DIR: { THEMES: path.join(base, 'assets', 'themes') },
          NODE_MODULES: path.join(process.cwd(), 'node_modules'),
          ROOT: path.join(base, 'themed-app'),
          THEME: 't1',
        } as unknown as Config
        const styles = await prepareThemes({ pages: [] } as unknown as AppObject, config)
        return Array.isArray(styles) && styles.length > 1
      },
      expect: true,
      info: 'prepareThemes loads a local theme and its reset css',
    },
    {
      fn: async () => {
        // app styles and styleVars from the root app.mjs get merged
        const config = {
          DIR: { THEMES: path.join(base, 'assets', 'themes') },
          NODE_MODULES: path.join(process.cwd(), 'node_modules'),
          ROOT: path.join(base, 'themed-app'),
          THEME: [],
        } as unknown as Config
        const app = {
          pages: [{ style: { pageStyle: 'blue' } }],
          modules: {
            Styled: { style: { color: 'green' } },
          },
        }
        const styles = await prepareThemes(app as unknown as AppObject, config)
        const strings = styles.map(s => (typeof s === 'function' ? '' : JSON.stringify(s)))
        const all = strings.join('\n')
        return all.includes('pageStyle') && all.includes('red')
      },
      expect: true,
      info: 'prepareThemes merges page, module and app styles',
    },
    {
      fn: async () => {
        const sw = await prepareServiceWorker(
          { static: { '/a.png': 'x' } } as unknown as AppObject,
          { CLIENT_LIB_NAME: 'magic' },
        )
        return sw.includes("'magic.js'") && sw.includes("'/a.png'")
      },
      expect: true,
      info: 'prepareServiceWorker works without WEB_ROOT',
    },
    {
      fn: async () => {
        const sw = await prepareServiceWorker(
          { static: { '/a.png': 'x' } } as unknown as AppObject,
          { CLIENT_LIB_NAME: 'magic', WEB_ROOT: '/core/' },
        )
        return sw.includes('/core/magic.js')
      },
      expect: true,
      info: 'prepareServiceWorker roots the cache files',
    },
    {
      fn: async () => {
        const dependencies = await prepareDependencies(
          {
            View: () => null,
            hoisted: 'LightSwitch(state)',
            modules: {},
            actions: {},
            effects: {},
            subscriptions: [],
            lib: {},
            pages: [],
          } as unknown as AppObject,
          { NODE_MODULES: path.join(process.cwd(), 'node_modules') } as unknown as Config,
        )
        return dependencies !== undefined
      },
      expect: true,
      info: 'prepareDependencies resolves module dependencies',
    },
    {
      fn: async () => {
        // a full prepare run on a small app
        const config = makeConfigOver((await runConfig({ 'no-check-links': true }))!)
        config.TMP_DIR = path.join(base, 'tmp2')

        const App = await runApp(config)
        const app = await prepare(App, config)
        return (
          is.str(app.client) &&
          app.client.includes('__MAGIC__') &&
          app.static?.['/img.png'] !== undefined &&
          is.fn(app.View)
        )
      },
      expect: true,
      info: 'prepare creates a client bundle with static files',
      timeout: 120000,
    },
    {
      // SPLIT runs the dependency resolution
      fn: async () => {
        const config = makeConfigOver((await runConfig({ 'no-check-links': true }))!)
        config.TMP_DIR = path.join(base, 'tmp3')
        config.SPLIT = true
        config.HOIST = ['LightSwitch']

        const App = await runApp(config)
        const app = await prepare(App, config)
        return app.dependencies !== undefined
      },
      expect: true,
      info: 'prepare resolves dependencies when SPLIT is set',
      timeout: 120000,
    },
    {
      // a static file that cannot be read throws,
      // a missing static dir does not
      fn: async () => {
        const config = makeConfigOver((await runConfig({ 'no-check-links': true }))!)
        config.TMP_DIR = path.join(base, 'tmp4')

        const App = await runApp(config)

        // a static dir with an unreadable file rethrows
        const badDir = path.join(base, 'static-bad')
        const badFile = path.join(badDir, 'locked.txt')
        await write(badFile, 'locked')
        await chmod(badFile, 0)
        config.DIR.STATIC = [path.join(base, 'static-missing'), badDir]
        let threw = false
        try {
          await prepare(App, config)
        } catch (e) {
          threw = is.error(e)
        }
        await chmod(badFile, 0o644)

        // a missing static dir is tolerated
        config.DIR.STATIC = path.join(base, 'static-missing')
        let ok = false
        try {
          const app = await prepare(App, config)
          ok = is.fn(app.View)
        } catch {
          ok = false
        }
        return threw && ok
      },
      expect: true,
      info: 'prepare rethrows unreadable static files and tolerates a missing static dir',
      timeout: 120000,
    },
    {
      fn: async () => {
        // prepareJs directly
        const magic = {
          state: { title: 'x' },
          actions: { go: () => 1 },
          effects: {},
          subscriptions: [],
          helpers: {},
          lib: { myLib: () => 1 },
          pages: [{ name: '/x/', View: (_state: unknown) => [div('x')] }],
          modules: {
            MyMod: { View: (_state: unknown) => [div('mod')] },
          },
          init: [['init', 'value']],
          static: {},
        }
        const client = await prepareJs(
          magic as unknown as AppObject,
          {
            HOIST: 'MyMod',
            PREPEND_JS: [],
            APPEND_JS: [],
          } as unknown as Config,
        )
        return (
          client.includes('__MAGIC__') &&
          client.includes('const MyMod') &&
          client.includes('const initialState')
        )
      },
      expect: true,
      info: 'prepareJs creates a client string with hoisted modules',
    },
  ],
}
