const fs = require('fs')
const path = require('path')
const is = require('@magic/types')
const deep = require('@magic/deep')
let components = require('../modules')

const keys = global.keys = new Set()

const globalize = (key, value) => {
  if (is.array(key)) {
    keys.add(key[0])
    global[key[0]] = key[1]
    return
  }

  keys.add(key)
  global[key] = value
}

let exists = false
const globals = ({ config }) => {
  global.config = config

  const maybeAssetFile = path.join(config.DIR.ASSETS, 'index.js')
  if (exists || fs.existsSync(maybeAssetFile)) {
    exists = true
    const assets = require(maybeAssetFile)
    components = deep.merge(components, assets)
  }

  Object.entries(components).forEach(globalize)
}

module.exports = globals