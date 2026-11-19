import type { AppObject, Config } from '../../../src/types.mjs'

import { is } from '@magic/test'

import { recursivelyResolveDependencies } from '../../../src/lib/swc/recursivelyResolveDependencies.mjs'

/**
 * fixture names referenced inside view sources. the views are only ever
 * stringified, never executed, so these stand-ins just need to exist
 */
const Page = (_: unknown): unknown[] => []
const Header = (_: unknown): unknown[] => []
const Router = (_: unknown): unknown[] => []
const Foo = (_: unknown): unknown[] => []
const Bar = (_: unknown): unknown[] => []
const Link = (_: unknown): unknown[] => []
const div = (_: unknown): unknown[] => []
const span = (_: unknown): unknown[] => []

/** minimal app state shape used by the fixture views */
type FixtureState = {
  pages: Record<string, unknown>
  url: string
  [key: string]: unknown
}

const makeApp = (over?: Record<string, unknown>) =>
  ({
    hoisted: `{ url: '/' }`,
    View: (state: FixtureState) => [Page({ page: state.pages[state.url], state }), Header(state)],
    modules: {
      Page: {
        View: (state: FixtureState) => [Router(state)],
      },
      Router: {
        View: (state: FixtureState) => [Foo(state)],
        Sub: {
          View: (state: FixtureState) => [Bar(state)],
        },
      },
      Foo: () => [div({ href: '/a/' })],
      Bar: () => [span(null)],
      Unused: () => [span(null)],
    },
    actions: {
      go: (state: FixtureState, _e: unknown) => state,
    },
    effects: {
      listen: (_dispatch: unknown) => () => {},
    },
    subscriptions: [['effects.listen', 'actions.go']],
    lib: {
      'prevent-default': () => {},
    },
    pages: [
      {
        name: '/a/',
        View: (state: FixtureState) => [Foo(state), Link({ to: '/b/' })],
      },
      {
        name: '/b/',
        View: (state: FixtureState) => [Bar(state)],
      },
    ],
    ...over,
  }) as unknown as AppObject

const makeConfig = (over?: Record<string, unknown>) =>
  ({
    WEB_ROOT: '/core/',
    ...over,
  }) as unknown as Config

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
      const pageA = (result.pages as Record<string, { modules?: string[] }>)['/a/']
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
          View: (state: FixtureState) => [div(state)],
          modules: {},
          actions: {},
          effects: {},
          subscriptions: [],
          lib: {},
          pages: [],
        } as unknown as AppObject,
        config: makeConfig(),
      })
      return is.obj(result) && is.arr(result.modules)
    },
    expect: true,
    info: 'recursivelyResolveDependencies handles an empty app',
  },
]
