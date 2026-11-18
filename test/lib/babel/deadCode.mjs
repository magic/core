import { is } from '@magic/test'

import magic from '../../../src/lib/babel/dead_code.mjs'

/**
 * minimal structural babel `types` implementation
 * @param {Record<string, unknown>} [over]
 */
const makeTypes = over => {
  /** @param {string} type */
  const ofType = type => (/** @param {unknown} node */ node) =>
    is.objectNative(node) && /** @type {any} */ (node).type === type
  return {
    isCallExpression: ofType('CallExpression'),
    isIdentifier: ofType('Identifier'),
    isMemberExpression: ofType('MemberExpression'),
    isObjectProperty: ofType('ObjectProperty'),
    isObjectExpression: ofType('ObjectExpression'),
    isStringLiteral: ofType('StringLiteral'),
    isArrayExpression: ofType('ArrayExpression'),
    isFunctionExpression: ofType('FunctionExpression'),
    isVariableDeclarator: ofType('VariableDeclarator'),
    ...over,
  }
}

/**
 * walk an ast and call enter with a path for every node
 * @param {unknown} node
 * @param {(path: Record<string, unknown>) => void} enter
 * @param {Record<string, unknown>[]} [removed]
 */
const walk = (node, enter, removed = []) => {
  if (!is.objectNative(node)) {
    return
  }
  /** @param {unknown} n */
  const makePath = n => ({
    node: n,
    removed: false,
    /** @this {Record<string, unknown>} */
    remove() {
      this.removed = true
      removed.push(/** @type {any} */ (n).type ? n : null)
    },
    /** @param {{ enter: Function }} opts */
    traverse(opts) {
      walk(n, opts.enter, removed)
    },
  })
  enter(makePath(node))
  for (const value of Object.values(/** @type {Record<string, unknown>} */ (node))) {
    if (is.array(value)) {
      value.forEach(v => walk(v, enter, removed))
    } else if (is.objectNative(value)) {
      walk(value, enter, removed)
    }
  }
}

/** @param {unknown} node */
const makeProgramPath = node => ({
  node,
  /** @param {{ enter: Function }} opts */
  traverse(opts) {
    walk(node, opts.enter)
  },
})

/** @param {string} name */
const declarator = name => ({
  type: 'VariableDeclarator',
  id: { type: 'Identifier', name },
  init: { type: 'Identifier', name: 'init' },
})

/**
 * run the plugin's Program enter and exit on a body of nodes
 * @param {{ modules?: Record<string, unknown>, lib?: Record<string, unknown> }} app
 * @param {Record<string, unknown>[]} body
 * @param {string} [WEB_ROOT]
 * @returns {{ removed: Record<string, unknown>[] }}
 */
const runProgram = (app, body, WEB_ROOT = '/core/') => {
  const plugin = magic(app, { WEB_ROOT })
  const { visitor } = plugin({ types: makeTypes() })
  /** @type {Record<string, unknown>[]} */
  const removed = []
  const program = { type: 'Program', body }
  const path = makeProgramPath(program)
  visitor.Program.enter({
    ...path,
    /** @param {{ enter: Function }} opts */
    traverse(opts) {
      // only traverse the body nodes
      body.forEach(node => walk(node, opts.enter, removed))
    },
  })
  visitor.Program.exit({
    ...path,
    /** @param {{ enter: Function }} opts */
    traverse(opts) {
      body.forEach(node => {
        walk(node, opts.enter, removed)
        // also walk into declarator inits
      })
    },
  })
  return { removed }
}

export default [
  {
    fn: () => {
      const app = { modules: { UsedMod: {} }, lib: {} }
      const body = [
        {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'UsedMod' },
          arguments: [],
        },
      ]
      const { removed } = runProgram(app, body)
      // UsedMod is used, so no removals
      return removed.length === 0
    },
    expect: true,
    info: 'dead_code keeps used modules',
  },
  {
    fn: () => {
      const app = { modules: { UnusedMod: {} }, lib: {} }
      const body = [
        {
          type: 'VariableDeclaration',
          declarations: [declarator('UnusedMod')],
        },
      ]
      const { removed } = runProgram(app, body)
      return removed.some(n => n?.id?.name === 'UnusedMod')
    },
    expect: true,
    info: 'dead_code removes unused @magic module declarations',
  },
  {
    fn: () => {
      const app = { modules: { tagA: () => {} }, lib: {} }
      const body = [
        {
          type: 'VariableDeclaration',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: { type: 'Identifier', name: 'tagA' },
              init: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'C' },
                arguments: [],
              },
            },
          ],
        },
      ]
      const { removed } = runProgram(app, body)
      // lowercase html tag created with C() and never used gets removed
      return removed.some(n => n?.id?.name === 'tagA')
    },
    expect: true,
    info: 'dead_code removes unused html tags created with C()',
  },
  {
    fn: () => {
      const app = { modules: { tagB: () => {} }, lib: {} }
      const body = [
        {
          type: 'VariableDeclaration',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: { type: 'Identifier', name: 'tagB' },
              init: { type: 'Identifier', name: 'somethingElse' },
            },
          ],
        },
      ]
      const { removed } = runProgram(app, body)
      // init is not a C() call, so it is kept
      return removed.length === 0
    },
    expect: true,
    info: 'dead_code keeps lowercase tags that are not created with C()',
  },
  {
    fn: () => {
      const app = { modules: {}, lib: { 'my-lib': 'string-lib' } }
      const body = [
        {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'lib' },
            property: { type: 'Identifier', name: 'myLib' },
          },
          arguments: [],
        },
      ]
      const { removed } = runProgram(app, body)
      return removed.length === 0
    },
    expect: true,
    info: 'dead_code accepts lib member expression calls',
  },
  {
    fn: () => {
      const app = { modules: {}, lib: {} }
      /** @type {Record<string, unknown>} */
      const hrefProp = {
        type: 'ObjectProperty',
        key: { type: 'Identifier', name: 'href' },
        value: { type: 'StringLiteral', value: '/local/' },
      }
      const body = [{ type: 'ObjectExpression', properties: [hrefProp] }]
      runProgram(app, body)
      // href gets web rooted by handleLink
      return /** @type {any} */ (hrefProp.value).value === '/core/local/'
    },
    expect: true,
    info: 'dead_code rewrites object property hrefs to the web root',
  },
  {
    fn: () => {
      const app = { modules: {}, lib: {} }
      /** @type {Record<string, unknown>} */
      const toProp = {
        type: 'ObjectProperty',
        key: { type: 'StringLiteral', value: 'to' },
        value: { type: 'StringLiteral', value: '/other/' },
      }
      const body = [{ type: 'ObjectExpression', properties: [toProp] }]
      runProgram(app, body)
      return /** @type {any} */ (toProp.value).value === '/core/other/'
    },
    expect: true,
    info: 'dead_code rewrites string literal key props to the web root',
  },
  {
    fn: () => {
      const app = { modules: {}, lib: {} }
      /** @type {Record<string, unknown>} */
      const extProp = {
        type: 'ObjectProperty',
        key: { type: 'Identifier', name: 'href' },
        value: { type: 'StringLiteral', value: 'https://example.com/x' },
      }
      const body = [{ type: 'ObjectExpression', properties: [extProp] }]
      runProgram(app, body)
      // external urls are left as-is
      return /** @type {any} */ (extProp.value).value === 'https://example.com/x'
    },
    expect: true,
    info: 'dead_code leaves external hrefs untouched',
  },
  {
    fn: () => {
      const app = { modules: {}, lib: {} }
      const body = [
        {
          type: 'ArrayExpression',
          elements: [
            {
              type: 'MemberExpression',
              object: { type: 'Identifier', name: 'actions' },
              property: { type: 'Identifier', name: 'go' },
            },
            null,
          ],
        },
      ]
      // should not throw, tracks the action
      runProgram(app, body)
      return true
    },
    expect: true,
    info: 'dead_code tracks actions in subscription arrays',
  },
  {
    fn: () => {
      const app = { modules: {}, lib: {} }
      const body = [
        {
          type: 'ArrayExpression',
          elements: [
            {
              type: 'MemberExpression',
              object: {
                type: 'MemberExpression',
                object: { type: 'Identifier', name: 'actions' },
                property: { type: 'Identifier', name: 'nested' },
              },
              property: { type: 'Identifier', name: 'deep' },
            },
            null,
          ],
        },
      ]
      // nested member expression action should not throw
      runProgram(app, body)
      return true
    },
    expect: true,
    info: 'dead_code handles nested member expression actions',
  },
  {
    fn: () => {
      const app = { modules: {}, lib: {} }
      const body = [
        {
          type: 'ArrayExpression',
          elements: [
            { type: 'Identifier', name: 'plain' },
            {
              type: 'MemberExpression',
              object: { type: 'Identifier', name: 'lib' },
              property: { type: 'Identifier', name: 'foo' },
            },
          ],
        },
      ]
      // identifier action + lib helper should not throw
      runProgram(app, body)
      return true
    },
    expect: true,
    info: 'dead_code handles plain identifier array elements',
  },
  {
    fn: () => {
      const app = { modules: {}, lib: {} }
      const body = [
        {
          type: 'VariableDeclaration',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: { type: 'Identifier', name: 'actions' },
              init: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'ObjectProperty',
                    key: { type: 'StringLiteral', value: 'fnAction' },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: { type: 'BlockStatement', body: [] },
                    },
                  },
                  {
                    type: 'ObjectProperty',
                    key: { type: 'StringLiteral', value: 'objAction' },
                    value: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'ObjectProperty',
                          key: { type: 'StringLiteral', value: 'inner' },
                          value: { type: 'Identifier', name: 'x' },
                        },
                      ],
                    },
                  },
                  {
                    type: 'ObjectProperty',
                    key: { type: 'StringLiteral', value: 'plainAction' },
                    value: { type: 'Identifier', name: 'y' },
                  },
                ],
              },
            },
          ],
        },
      ]
      // walking the actions object should not throw or remove
      const { removed } = runProgram(app, body)
      return removed.length === 0
    },
    expect: true,
    info: 'dead_code inspects the actions object without removing it',
  },
  {
    fn: () => {
      const app = { modules: {}, lib: {} }
      const body = [
        {
          type: 'VariableDeclaration',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: { type: 'Identifier', name: 'lib' },
              init: { type: 'ObjectExpression', properties: [] },
            },
          ],
        },
      ]
      const { removed } = runProgram(app, body)
      return removed.length === 0
    },
    expect: true,
    info: 'dead_code keeps the lib object declaration',
  },
  {
    fn: () => {
      const app = { modules: {}, lib: {} }
      const body = [
        {
          type: 'VariableDeclaration',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: { type: 'Identifier', name: 'something' },
              init: { type: 'Identifier', name: 'x' },
            },
          ],
        },
      ]
      const { removed } = runProgram(app, body)
      return removed.length === 0
    },
    expect: true,
    info: 'dead_code keeps unrelated declarations',
  },
]
