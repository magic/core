const path = require('path')
const fs = require('fs')

const log = require('@magic/log')

const browserify = require('browserify')
// const babel = require('@babel/core')

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
    // seems to have no real benefit
    // type constructors are a nono anyways.
    // plugins.push('minify-type-constructors')
    plugins.push('minify-builtins')
    plugins.push('transform-minify-booleans')
  }
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

module.exports = async ({ str }) => {
  const filePath = path.join(process.cwd(), '.__browserify_empty.js')
  fs.writeFileSync(filePath, str)

  // const ast = await babel.parseAsync(str)

  // const isLink = val => !val.includes(' ') && (val.includes('://') || val.startsWith('/')) && val !== '://' && val.length > 1

  // babel.traverse(ast, {
  //   StringLiteral(path) {
  //     if (isLink(path.node.value)) {
  //       console.log(path)
  //       if (path.container.type === 'ObjectProperty') {

  //       }
  //       process.exit(1)
  //     }
  //   },
  //   // ObjectProperty(path) {
  //   //   const paths = ['to', 'src', 'href', 'to', 'action', 'logo']
  //   //   if (paths.includes(path.node.key.name)) {
  //   //     if (node.type === 'TemplateLiteral') {

  //   //     } else if (node.type === '')
  //   //     console.log(path.node.value)
  //   //     // process.exit(1)
  //   //   }
  //   // },
  //   enter(path) {
  //     if (path.node.name) {
  //       // if (path.node.name === 'Link') {
  //       //   const { hub, ...rest } = path
  //       //   console.log('is link', rest)

  //       //   process.exit(1)
  //       // }
  //       // if (global[path.node.name]) {
  //       //   console.log(path.node.name)
  //       // }
  //     }
  //     // if (path.isIdentifier({ name: "n" })) {
  //     //   path.node.name = "x";
  //     // }
  //   }
  // })

  // const res = await babel.transformFromAstAsync(ast, str, babelOpts)
  // console.log({res})
  try {
    return new Promise((res, rej) =>
      browserify(filePath)
        .transform('babelify', babelOpts)
        .bundle((err, src) => {
          if (!config.KEEP_CLIENT && !process.argv.includes('--keep-client')) {
            fs.unlinkSync(filePath)
          }
          if (err) {
            rej(err)
          } else {
            res(src.toString())
          }
        })
        .catch(err => {
          log.error(e, `error in page ${filePath}`)
        })
    )
  } catch(e) {
    log.error(e, `error in page ${filePath}`)
  }
}
