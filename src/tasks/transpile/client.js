const path = require('path')
const fs = require('fs')
const browserify = require('browserify')

const isProd = process.env.NODE_ENV === 'production'
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
  plugins.push(['minify-mangle-names', { topLevel: true }])
  plugins.push('minify-dead-code-elimination')
  plugins.push('transform-remove-console')
  plugins.push('transform-remove-debugger')
  plugins.push('minify-simplify')
  plugins.push('minify-type-constructors')
  plugins.push('minify-builtins')
  plugins.push('transform-minify-booleans')
}

const babelOpts = {
  filename: 'magic.js',
  minified: isProd,
  comments: isDev,
  configFile: false,
  sourceMaps: false,
  presets: isProd ? presets : [],
  plugins,
}

module.exports = ({ str }) => {
  const filePath = path.join(process.cwd(), '.__browserify_empty.js')
  fs.writeFileSync(filePath, str)

  return new Promise((res, rej) =>
    browserify(filePath)
      .transform('babelify', babelOpts)
      .bundle((err, src) => {
        fs.unlinkSync(filePath)

        if (err) {
          rej(err)
        } else {
          res(src.toString())
        }
      }),
  )
}
