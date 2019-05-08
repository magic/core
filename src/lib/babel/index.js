const babel = require('@babel/core')

const isProd = config.ENV === 'production'
const isDev = !isProd

const presets = [
  [
    '@babel/preset-env',
    {
      targets: '>0.25%, not dead',
      // useBuiltIns: 'entry',
      forceAllTransforms: true,
      ignoreBrowserslistConfig: true,
      modules: false,
      debug: isDev,
    },
  ],
]

const plugins = [
  '@babel/plugin-transform-arrow-functions',
  '@babel/plugin-proposal-object-rest-spread',
]

if (isProd) {
  const minify = !process.argv.includes('--no-minify')
  if (minify && !process.argv.includes('--no-mangle-names')) {
    plugins.push(['minify-mangle-names', { topLevel: true }])
  }

  if (!process.argv.includes('--keep-dead-code')) {
    plugins.push(['minify-dead-code-elimination'])
  }

  if (!process.argv.includes('--keep-console')) {
    plugins.push('transform-remove-console')
  }

  if (!process.argv.includes('--keep-debugger')) {
    plugins.push('transform-remove-debugger')
  }

  plugins.push([
    'remove-code',
    {
      function: ['CHECK_PROPS'],
    },
  ])

  if (minify) {
    plugins.push('minify-simplify')
    plugins.push('minify-type-constructors')
    plugins.push('minify-builtins')
    plugins.push('transform-minify-booleans')
  }
}

babel.opts = {
  filename: `${config.CLIENT_LIB_NAME}.js`,
  minified: isProd,
  comments: isDev,
  configFile: false,
  sourceMaps: false,
  presets: isProd ? presets : [],
  plugins,
}

module.exports = babel
