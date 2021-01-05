import magic from './dead_code.mjs'

export const getBabelConf = (app, config) => {
  const {
    CLIENT_LIB_NAME,
    BABEL_DEBUG,
    REMOVE_CHECK_PROPS,
    MINIFY,
    USE_PRESETS,
    KEEP_COMMENTS,
  } = config.BABEL

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
