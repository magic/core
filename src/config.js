const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()

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

const PAGE = path.join(config.ROOT, 'pages')
const TMP = path.join(process.cwd(), '.tmp')

config = {
  ...config,
  DIR: {
    PAGE,
    TMP,
  },
}


module.exports = config
