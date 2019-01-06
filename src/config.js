const fs = require('fs')
const path = require('path')

const configPath = path.join(process.cwd(), 'config.js')
let config = {}
if (fs.existsSync(configPath)) {
  config = require(configPath)
  if (config.ROOT) {
    config.ROOT = path.resolve(process.cwd(), config.ROOT)
  } else {
    config.ROOT = process.cwd()
  }
}

const PAGES = path.join(config.ROOT, 'pages')
const PUBLIC = path.join(process.cwd(), 'public')
const ASSETS = path.join(config.ROOT, 'assets')
const MODULES = path.join(config.ROOT, 'modules')
const STATIC = path.join(config.ROOT, 'static')

config = {
  ...config,
  DIR: {
    PAGES,
    PUBLIC,
    ASSETS,
    MODULES,
    STATIC,
  },
}

module.exports = config
