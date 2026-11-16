import magic from './dead_code.mjs'

/** @import { AppObject, Config } from '../../types.mjs' */

/**
 * The `BABEL` section of a magic config.
 * @typedef {{ CLIENT_LIB_NAME?: string, BABEL_DEBUG?: boolean, REMOVE_CHECK_PROPS?: boolean, MINIFY?: boolean, USE_PRESETS?: boolean, KEEP_COMMENTS?: boolean }} BabelConfig */

/**
 * A babel preset or plugin entry.
 * @typedef {string | [string, { [key: string]: unknown }]} BabelEntry */

/**
 * A babel plugin function, as returned by `./dead_code.mjs`.
 * @typedef {(opts: { types: { [key: string]: (node: unknown) => boolean } }) => { visitor: unknown }} BabelPluginFn */

/**
 * @param {AppObject} app
 * @param {Config} config
 * @returns {Record<string, unknown>}
 */
export const getBabelConf = (app, config) => {
  const babelConfig = /** @type {BabelConfig} */ (config.BABEL ?? {})
  const { CLIENT_LIB_NAME, BABEL_DEBUG, REMOVE_CHECK_PROPS, MINIFY, USE_PRESETS, KEEP_COMMENTS } =
    babelConfig

  /** @type {BabelEntry[]} */
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          firefox: 75,
          chrome: 60,
          edge: 80,
          safari: 12,
        },
        forceAllTransforms: true,
        ignoreBrowserslistConfig: true,
        debug: BABEL_DEBUG,
      },
    ],
  ]

  /** @type {(BabelEntry | BabelPluginFn)[]} */
  const plugins = [['@babel/plugin-transform-react-jsx', { pragma: 'h' }], magic(app, config)]

  if (REMOVE_CHECK_PROPS) {
    plugins.push([
      'remove-code',
      {
        function: ['CHECK_PROPS'],
      },
    ])
  }

  if (MINIFY) {
    presets.push([
      'minify',
      {
        // this might sometimes break pages in production.
        // "too much recursion".
        // 17.02.2021: should be fixed. still left the comment for future reference
        mangle: {
          topLevel: true,
        },
        removeConsole: !config.KEEP_CONSOLE,
        removeDebugger: !config.KEEP_DEBUGGER,
      },
    ])
  }

  const sourceMaps = config.ENV === 'development' ? 'inline' : false

  return {
    filename: `${CLIENT_LIB_NAME}.js`,
    minified: MINIFY,
    comments: KEEP_COMMENTS,
    configFile: false,
    sourceMaps,
    presets: USE_PRESETS ? presets : [],
    plugins,
  }
}
