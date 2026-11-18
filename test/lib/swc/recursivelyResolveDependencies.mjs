import { is } from '@magic/test'

import { recursivelyResolveDependencies } from '../../../src/lib/swc/recursivelyResolveDependencies.mjs'

/** @param {Record<string, unknown>} [over] */
const makeApp = over => ({
  hoisted: `{ url: '/' }`,
  View: state => [Page({ page: state.pages[state.url], state }), Header(state)],
  modules: {
    Page: {
      View: state => [Router(state)],
    },
    Router: {
      View: state => [Foo(state)],
      Sub: {
        View: state => [Bar(state)],
      },
    },
    Foo: () => [div({ href: '/a/' })],
    Bar: () => [span(null)],
    Unused: () => [span(null)],
  },
  actions: {
    go: (state, _e) => state,
  },
  effects: {
    listen: _dispatch => () => {},
  },
  subscriptions: [['effects.listen', 'actions.go']],
  lib: {
    'prevent-default': () => {},
  },
  pages: [
    {
      name: '/a/',
      View: state => [Foo(state), Link({ to: '/b/' })],
    },
    {
      name: '/b/',
      View: state => [Bar(state)],
    },
  ],
  ...over,
})

/** @param {Record<string, unknown>} [over] */
const makeConfig = over => ({
  WEB_ROOT: '/core/',
  ...over,
})

export default [
  {
    fn: async () => {
      const result = await recursivelyResolveDependencies({ app: makeApp(), config: makeConfig() })
      return (
        is.obj(result) &&
        is.arr(result.modules) &&
        result.modules.includes('Foo') &&
        result.modules.includes('Bar') &&
        !result.modules.includes('Unused')
      )
    },
    expect: true,
    info: 'recursivelyResolveDependencies collects used modules',
  },
  {
    fn: async () => {
      const result = await recursivelyResolveDependencies({ app: makeApp(), config: makeConfig() })
      const pageA = /** @type {any} */ (result.pages['/a/'])
      return is.arr(pageA?.modules) && pageA.modules.includes('Foo')
    },
    expect: true,
    info: 'recursivelyResolveDependencies records used modules per page',
  },
  {
    fn: async () => {
      const result = await recursivelyResolveDependencies({ app: makeApp(), config: makeConfig() })
      return (
        is.obj(result.modulesByPage) &&
        is.arr(result.singlePageModules) &&
        // Bar is only used on /b/
        JSON.stringify(result.modulesByPage).includes('"/b/"')
      )
    },
    expect: true,
    info: 'recursivelyResolveDependencies maps modules to pages',
  },
  {
    fn: async () => {
      const result = await recursivelyResolveDependencies({ app: makeApp(), config: makeConfig() })
      return (
        is.arr(result.actions) &&
        is.arr(result.effects) &&
        is.arr(result.subscriptions) &&
        is.arr(result.lib)
      )
    },
    expect: true,
    info: 'recursivelyResolveDependencies tracks actions, effects, subscriptions and lib',
  },
  {
    fn: async () => {
      // app without pages or modules still resolves
      const result = await recursivelyResolveDependencies({
        app: {
          hoisted: `{}`,
          View: state => [div(state)],
          modules: {},
          actions: {},
          effects: {},
          subscriptions: [],
          lib: {},
          pages: [],
        },
        config: makeConfig(),
      })
      return is.obj(result) && is.arr(result.modules)
    },
    expect: true,
    info: 'recursivelyResolveDependencies handles an empty app',
  },
]
