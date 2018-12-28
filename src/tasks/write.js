const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')

const { mkdirp } = require('../lib')

let presets = [
  [
    'env',
    {
      modules: false,
      targets: {
        browsers: ['last 2 versions', 'safari >= 7'],
      },
    },
  ],
]

const babelOpts = {
  sourceMaps: 'both',
  presets,
}

const write = ({ pages, vendor, style, config }) => {
  write.html({ pages, config })
  fs.writeFileSync(path.join(config.DIR.TMP, 'vendor.js'), vendor.bundle.code)
  fs.writeFileSync(path.join(config.DIR.TMP, 'vendor.min.js'), vendor.minified.code)
  fs.writeFileSync(path.join(config.DIR.TMP, 'main.css'), style.minified)
}

write.html = ({ pages, config }) => {
  pages.forEach(page => {
    let pagePath = path.join(config.DIR.TMP, page.name)
    mkdirp(pagePath)
    if (!pagePath.endsWith('index.js') && pagePath.endsWith('/')) {
      pagePath = path.join(pagePath, 'index.html')
    }
    fs.writeFileSync(pagePath, page.rendered)
  })
}

write.ast = (code, opts) => parse(code, opts)

module.exports = write
