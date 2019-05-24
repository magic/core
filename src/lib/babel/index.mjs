// import { tags } from '../../modules/tags.mjs'
import magic from './dead_code.mjs'

export const runBabel = (app, config) => {
  const { IS_PROD, IS_DEV, CLIENT_LIB_NAME } = config

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
        debug: IS_DEV,
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

  if (IS_PROD) {
    plugins.push([
      'remove-code',
      {
        function: ['CHECK_PROPS'],
      },
    ])
  }

  if (IS_PROD) {
    const minify = !process.argv.includes('--no-minify')
    if (minify) {
      const argv = process.argv
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
    minified: IS_PROD,
    comments: IS_DEV,
    configFile: false,
    sourceMaps: false,
    presets: IS_PROD ? presets : [],
    plugins,
  }
}
