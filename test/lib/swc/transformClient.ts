import type { Module, ParseOptions, Program } from '@swc/core'
import type { AppObject, Config, SwcNode } from '../../../src/types.mjs'

import { is } from '@magic/test'

import swc from '@swc/core'
import { transformClient } from '../../../src/lib/swc/index.mjs'
import { resolveDependencies } from '../../../src/lib/swc/resolveDependencies.mjs'
import { visit, used } from '../../../src/lib/swc/visit.mjs'

// visit.mjs keeps a module level `used` object -
// serialize the tests that mutate it
let chain: Promise<unknown> = Promise.resolve()
const lock = (fn: () => Promise<unknown>) => {
  const run = chain.then(fn, fn)
  chain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

const makeApp = (over?: Record<string, unknown>) =>
  ({
    modules: { Foo: {}, Bar: {} },
    lib: { 'my-lib': () => 1 },
    links: [],
    ...over,
  }) as unknown as AppObject

const makeConfig = (over?: Record<string, unknown>) =>
  ({
    WEB_ROOT: '/core/',
    CLIENT_LIB_NAME: 'magic',
    IS_PROD: false,
    ...over,
  }) as unknown as Config

/** structural view of the swc nodes the visit tests read */
type SwcValue = { value: string; type?: string }
type SwcStmt = {
  expression: { arguments: { expression: { properties: { value: SwcValue }[] } }[] }
}

const CODE = `
const Foo = () => h('div')
const Bar = () => h('div')
const __MAGIC__ = () => {
  const initialState = { url: '/' }
  const actions = { go: () => {} }
  const unusedLocal = 1
  const keepCore = h
  console.log('dev only')
  Foo(initialState)
  source({ href: '/a/' })
  img({ src: '/logo.png', alt: 'x' })
  source({ src: someVar })
  CHECK_PROPS('Foo', initialState)
  return initialState
}
__MAGIC__()
`

/**
 * @param {string} code
 * @param {Record<string, string>} [moduleNames]
 * @param {Record<string, unknown>} [app]
 * @returns {Promise<{ ast: any, app: Record<string, unknown>, config: Record<string, unknown> }>}
 */
const parseAndVisit = async (
  code: string,
  moduleNames: string[] = ['Foo', 'Bar'],
  app: AppObject = makeApp(),
) => {
  used.modules = new Set()
  used.moduleNames = new Set(moduleNames)
  const ast = await swc.parse(code, {
    syntax: 'typescript',
    jsx: true,
    isModule: true,
    target: 'es2017',
  } as unknown as ParseOptions)
  const config = makeConfig()
  ast.body = ast.body.map(item =>
    visit({
      par: item as unknown as SwcNode,
      parent: item as unknown as SwcNode,
      app,
      config,
    }),
  ) as unknown as Module['body']
  return { ast, app, config }
}

export default {
  transformClient: [
    {
      fn: async () => {
        const result = await transformClient(undefined, makeApp(), makeConfig())
        return result === 'const __MAGIC__ = () => {};\n__MAGIC__();\n'
      },
      expect: true,
      info: 'transformClient returns a minimal client for non-string code',
    },
    {
      fn: async () => {
        const app = makeApp()
        const result = await transformClient(CODE, app, makeConfig())
        return (
          is.str(result) &&
          result.includes('Foo') &&
          !result.includes('unusedLocal') &&
          !result.includes('CHECK_PROPS')
        )
      },
      expect: true,
      info: 'transformClient removes dead code and CHECK_PROPS calls',
    },
    {
      fn: async () => {
        const app = makeApp()
        await transformClient(CODE, app, makeConfig())
        // Bar is never used, Foo is
        return Object.keys(app.modules ?? {}).join(',') === 'Foo'
      },
      expect: true,
      info: 'transformClient filters unused modules from app.modules',
    },
    {
      fn: async () => {
        const app = makeApp()
        const result = await transformClient(CODE, app, makeConfig())
        return result.includes('/core/a') && result.includes('/core/logo.pn')
      },
      expect: true,
      info: 'transformClient rewrites source and img urls to web root',
    },
    {
      fn: async () => {
        const app = makeApp()
        const dev = await transformClient(CODE, app, makeConfig({ IS_PROD: false }))
        const prod = await transformClient(CODE, makeApp(), makeConfig({ IS_PROD: true }))
        return dev.includes('dev only') && !prod.includes('dev only')
      },
      expect: true,
      info: 'transformClient drops console in production only',
    },
    {
      fn: async () => {
        const app = makeApp()
        const code = `
const __MAGIC__ = () => {
  const x = 1
  return x
}
__MAGIC__()
`
        const result = await transformClient(code, app, makeConfig())
        return is.str(result) && result.length > 0
      },
      expect: true,
      info: 'transformClient handles simple __MAGIC__ code',
    },
  ],
  visit: [
    {
      fn: async () =>
        lock(async () => {
          const { ast } = await parseAndVisit(
            `
const Foo = () => 1
const a = 1
const arr = [1, 2]
const obj = { href: '/a/', to: '#h' }
const [x, ...rest] = arr
const { p = 1 } = obj
Foo()
const arrow = (y) => {
  if (a > 1) {
    return a
  } else {
    return 0
  }
}
const fexpr = function (z) {
  for (let i = 0; i < 10; i++) {
    break
  }
  for (const k in obj) {
    continue
  }
  for (const v of arr) {
    console.log(v)
  }
  while (a) {
    a = 0
  }
  try {
    a += 1
    a++
  } catch (err) {
    a = 2
  }
  const s = \`t \${a} e\`
  const spread = [...rest]
  const cond = a ? 1 : 2
  const un = !a
  const bin = a + 1
  const neu = new Error('x')
  const opt = obj?.href
  const computed = obj['href']
  return { s, spread, cond, un, bin, neu, opt, computed }
}
import { something } from 'mod'
export { a }
`,
          )
          const { code: printed } = await swc.print(ast as Program, {
            filename: 'x.js',
            isModule: true,
          })
          return used.modules.has('Foo') && printed.includes('function')
        }),
      expect: true,
      info: 'visit traverses a wide range of node types and tracks module calls',
    },
    {
      fn: async () =>
        lock(async () => {
          const { ast, app, config } = await parseAndVisit('CHECK_PROPS("Foo", {})', [])
          const result = visit({
            par: ast.body as unknown as SwcNode[],
            parent: ast.body[0] as unknown as SwcNode,
            app,
            config,
          })
          // the ExpressionStatement is replaced by an EmptyStatement
          return result?.type === 'EmptyStatement'
        }),
      expect: true,
      info: 'visit replaces CHECK_PROPS expression statements with empty statements',
    },
    {
      fn: async () =>
        lock(async () => {
          const { ast } = await parseAndVisit('source({ href: "/local/" })', [])
          const stmt = ast.body[0] as unknown as SwcStmt
          const prop = stmt.expression.arguments[0].expression.properties[0]
          return prop.value.value === '/core/local'
        }),
      expect: true,
      info: 'visit rewrites source href urls to the web root',
    },
    {
      fn: async () =>
        lock(async () => {
          const { ast } = await parseAndVisit('source({ href: externalUrl })', [])
          const stmt = ast.body[0] as unknown as SwcStmt
          const prop = stmt.expression.arguments[0].expression.properties[0]
          // identifiers are left untouched
          return prop.value.type === 'Identifier'
        }),
      expect: true,
      info: 'visit leaves identifier urls untouched',
    },
    {
      fn: async () =>
        lock(async () => {
          const { ast } = await parseAndVisit('source({ href: `template` })', [])
          const stmt = ast.body[0] as unknown as SwcStmt
          const prop = stmt.expression.arguments[0].expression.properties[0]
          // template literals are left untouched
          return prop.value.type === 'TemplateLiteral'
        }),
      expect: true,
      info: 'visit leaves template literal urls untouched',
    },
    {
      fn: async () =>
        lock(async () => {
          const { ast } = await parseAndVisit('source({ href: "https://example.com/x" })', [])
          const stmt = ast.body[0] as unknown as SwcStmt
          const prop = stmt.expression.arguments[0].expression.properties[0]
          // external urls are not rewritten
          return prop.value.value === 'https://example.com/x'
        }),
      expect: true,
      info: 'visit leaves external urls untouched',
    },
    {
      fn: async () =>
        lock(async () => {
          await parseAndVisit('const o = { to: Bar }')
          return used.modules.has('Bar')
        }),
      expect: true,
      info: 'visit tracks module identifiers used as object values',
    },
    {
      fn: () => visit({ par: undefined, parent: undefined, app: makeApp(), config: makeConfig() }),
      expect: undefined,
      info: 'visit returns undefined for undefined parents',
    },
  ],
  resolveDependencies: [
    {
      fn: async () => {
        const app = makeApp()
        const code = `
const actions = {
  go: (state, e) => {
    effects.listenPopState(dispatch, 'actions.pop')
    return state
  },
}
const effects = {
  listenPopState: (dispatch, action) => {
    dispatch(action)
    return () => {}
  },
}
const helpers = { format: () => 'x' }
const subscriptions = [['effects.listenPopState', 'actions.pop']]
lib['my-lib']()
Foo()
Bar.sub()
actions.go()
`
        const ast = await swc.parse(code)
        const usedDeps = resolveDependencies({ parent: ast as unknown as SwcNode, app })
        return (
          usedDeps.modules.includes('Foo') &&
          usedDeps.modules.includes('Bar.sub') &&
          usedDeps.actions.includes('go')
        )
      },
      expect: true,
      info: 'resolveDependencies tracks modules and actions from code',
    },
    {
      fn: async () => {
        const app = makeApp()
        const code = `
const arr = [actions.go, effects.listen]
const obj = { a: 1 }
const [first, ...rest] = arr
const fn = (x) => x
const y = 1 > 0 ? 1 : 0
const z = !y
const w = y + 1
const n = new Error('x')
const p = (obj, arr)
let m = 0
m++
m += 1
if (y) {
  m = 1
} else {
  m = 0
}
for (let i = 0; i < 3; i++) {
  break
}
while (y) {
  continue
}
try {
  obj.x
} catch (e) {
  m = 2
}
const t = \`a \${y} b\`
const s = [...rest]
const r = obj?.a
const c = obj['a']
import { x } from 'm'
export { z }
`
        const ast = await swc.parse(code, {
          syntax: 'ecmascript',
          isModule: true,
        } as unknown as ParseOptions)
        const usedDeps = resolveDependencies({ parent: ast as unknown as SwcNode, app })
        return (
          is.obj(usedDeps) &&
          is.arr(usedDeps.modules) &&
          usedDeps.actions.includes('go') &&
          usedDeps.effects.includes('listen')
        )
      },
      expect: true,
      info: 'resolveDependencies handles a wide range of node types',
    },
  ],
}
