import type { AppObject, Config } from '../../../src/types.mjs'

import { is } from '@magic/test'

import { getBabelConf } from '../../../src/lib/babel/index.mjs'

/** a babel plugin/preset option bag, as read by the tests below */
type BabelOpts = {
  function: string
  removeConsole?: boolean
  removeDebugger?: boolean
  debug?: boolean
  [key: string]: unknown
}

type BabelEntry = string | [string, BabelOpts]

type BabelConf = {
  filename: string
  minified?: boolean
  configFile: boolean
  sourceMaps: string | boolean
  comments?: boolean
  presets: BabelEntry[]
  plugins: BabelEntry[]
}

const makeConfig = (over?: Record<string, unknown>) =>
  ({
    ENV: 'development',
    BABEL: { CLIENT_LIB_NAME: 'magic' },
    ...over,
  }) as unknown as Config

const makeApp = (over?: Record<string, unknown>) => ({ ...over }) as unknown as AppObject

export default [
  {
    fn: () => {
      const conf = getBabelConf(makeApp(), makeConfig()) as BabelConf
      return (
        conf.filename === 'magic.js' &&
        conf.minified === undefined &&
        conf.configFile === false &&
        conf.sourceMaps === 'inline' &&
        Array.isArray(conf.presets) &&
        conf.presets.length === 0 &&
        is.arr(conf.plugins) &&
        conf.plugins.length === 2
      )
    },
    expect: true,
    info: 'getBabelConf returns development defaults',
  },
  {
    fn: () => {
      const conf = getBabelConf(makeApp(), makeConfig({ ENV: 'production' })) as BabelConf
      return conf.sourceMaps === false
    },
    expect: true,
    info: 'getBabelConf disables source maps in production',
  },
  {
    fn: () => {
      const conf = getBabelConf(
        makeApp({}),
        makeConfig({
          BABEL: { CLIENT_LIB_NAME: 'magic', USE_PRESETS: true },
        }),
      ) as BabelConf
      // presets only included when USE_PRESETS is set
      return (
        is.arr(conf.presets) &&
        conf.presets.length === 1 &&
        conf.presets[0][0] === '@babel/preset-env'
      )
    },
    expect: true,
    info: 'getBabelConf includes presets when USE_PRESETS is set',
  },
  {
    fn: () => {
      const conf = getBabelConf(
        makeApp(),
        makeConfig({
          BABEL: { CLIENT_LIB_NAME: 'magic', REMOVE_CHECK_PROPS: true },
        }),
      ) as BabelConf
      const removeCode = conf.plugins.find(p => Array.isArray(p) && p[0] === 'remove-code') as
        | [string, BabelOpts]
        | undefined
      return is.arr(removeCode) && removeCode[1].function.includes('CHECK_PROPS')
    },
    expect: true,
    info: 'getBabelConf adds the remove-code plugin when REMOVE_CHECK_PROPS is set',
  },
  {
    fn: () => {
      const conf = getBabelConf(
        makeApp(),
        makeConfig({
          BABEL: { CLIENT_LIB_NAME: 'magic', MINIFY: true, USE_PRESETS: true },
          ENV: 'production',
        }),
      ) as BabelConf
      const minify = conf.presets.find(p => Array.isArray(p) && p[0] === 'minify') as
        | [string, BabelOpts]
        | undefined
      return (
        conf.minified === true &&
        is.arr(minify) &&
        minify[1].removeConsole === true &&
        minify[1].removeDebugger === true
      )
    },
    expect: true,
    info: 'getBabelConf adds the minify preset when MINIFY is set',
  },
  {
    fn: () => {
      const conf = getBabelConf(
        makeApp(),
        makeConfig({
          BABEL: {
            CLIENT_LIB_NAME: 'magic',
            MINIFY: true,
            USE_PRESETS: true,
            KEEP_COMMENTS: true,
            BABEL_DEBUG: true,
          },
          ENV: 'production',
        }),
      ) as BabelConf
      const minify = conf.presets.find(p => Array.isArray(p) && p[0] === 'minify') as [
        string,
        BabelOpts,
      ]
      const presetEnv = conf.presets.find(
        p => Array.isArray(p) && p[0] === '@babel/preset-env',
      ) as [string, BabelOpts]
      return (
        conf.comments === true && minify[1].removeConsole === true && presetEnv[1].debug === true
      )
    },
    expect: true,
    info: 'getBabelConf honors KEEP_COMMENTS and BABEL_DEBUG',
  },
  {
    fn: () => {
      const conf = getBabelConf(
        makeApp(),
        makeConfig({
          BABEL: {
            CLIENT_LIB_NAME: 'magic',
            MINIFY: true,
            USE_PRESETS: true,
            KEEP_CONSOLE: true,
            KEEP_DEBUGGER: true,
          },
          ENV: 'production',
          KEEP_CONSOLE: true,
          KEEP_DEBUGGER: true,
        }),
      ) as BabelConf
      const minify = conf.presets.find(p => Array.isArray(p) && p[0] === 'minify') as [
        string,
        BabelOpts,
      ]
      return minify[1].removeConsole === false && minify[1].removeDebugger === false
    },
    expect: true,
    info: 'getBabelConf keeps console and debugger when configured',
  },
  {
    fn: () => {
      const conf = getBabelConf(
        makeApp({}),
        makeConfig({
          BABEL: { CLIENT_LIB_NAME: 'custom' },
        }),
      )
      return conf.filename === 'custom.js'
    },
    expect: true,
    info: 'getBabelConf uses the babel CLIENT_LIB_NAME for the filename',
  },
  {
    fn: () => {
      // no BABEL config at all falls back to the defaults;
      // without CLIENT_LIB_NAME the filename is 'undefined.js'
      const conf = getBabelConf(makeApp({}), {
        ENV: 'development',
      } as unknown as Config) as BabelConf
      return conf.filename === 'undefined.js' && is.arr(conf.plugins)
    },
    expect: true,
    info: 'getBabelConf works without a BABEL config',
  },
]
