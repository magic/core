import magic from './dead_code.mjs'
import removeCode from './remove_code.mjs'

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

  const tagNames = Object.keys(app.modules)
  const actionNames = Object.keys(app.actions)
  const usedActionNames = Object.keys(app.used.actions)

  app.unused = {
    tags: tagNames.filter(a => !app.used.tags.has(a)),
    actions: actionNames.filter(a => !usedActionNames.includes(a)),
  }

  if (MINIFY) {
    plugins.push(
      removeCode({
        function: ['CHECK_PROPS'],
      }),
    )

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
