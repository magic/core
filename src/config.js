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
const TMP = path.join(process.cwd(), '.tmp')
const ASSETS = path.join(config.ROOT, 'assets')

config = {
  ...config,
  DIR: {
    PAGES,
    TMP,
    ASSETS,
  },
}

module.exports = config
