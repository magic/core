const babel = require('@babel/core')

const isProd = process.env.NODE_ENV === 'production'

const presets = [
  [
    '@babel/preset-env',
    {
      targets: '>0.25%, not dead',
      // useBuiltIns: 'entry',
      forceAllTransforms: true,
      ignoreBrowserslistConfig: true,
      modules: false,
      debug: !isProd,
    },
  ],
]

const plugins = ['@babel/plugin-transform-arrow-functions']
if (isProd) {
  plugins.push(['minify-mangle-names', { topLevel: true }])
  plugins.push('minify-dead-code-elimination')
}

const babelOpts = {
  filename: 'magic.js',
  minified: isProd,
  comments: !isProd,
  configFile: false,
  sourceMaps: false,
  presets: isProd ? presets : [],
  plugins: isProd ? plugins : [],
}

module.exports = lib => {
  const str = lib.str
  return babel.transformSync(str, babelOpts)
}
