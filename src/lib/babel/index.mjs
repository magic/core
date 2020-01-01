import magic from './dead_code.mjs'

export const getBabelConf = (app, config) => {
  const {
    CLIENT_LIB_NAME,
    BABEL_DEBUG,
    DEAD_CODE,
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
          browsers: 'last 2 versions',
        },
        forceAllTransforms: true,
        ignoreBrowserslistConfig: true,
        // modules: false,
        debug: BABEL_DEBUG,
      },
    ],
  ]

  const plugins = [
    ['@babel/plugin-transform-react-jsx', { pragma: 'h' }],
    magic(app, config),
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-export-namespace-from',
  ]

  if (REMOVE_CHECK_PROPS) {
    plugins.push([
      'remove-code',
      {
        function: ['CHECK_PROPS'],
      },
    ])
  }

  if (MINIFY) {
    const { argv } = process
    const minify = !argv.includes('--no-minify')
    if (minify) {
      presets.push([
        'minify',
        {
          mangle: {
            topLevel: true,
          },
          removeConsole: !argv.includes('--keep-console'),
          removeDebugger: !argv.includes('--keep-debugger'),
        },
      ])
    }
  }

  return {
    filename: `${CLIENT_LIB_NAME}.js`,
    minified: MINIFY,
    comments: KEEP_COMMENTS,
    configFile: false,
    sourceMaps: false,
    presets: USE_PRESETS ? presets : [],
    plugins,
  }
}
