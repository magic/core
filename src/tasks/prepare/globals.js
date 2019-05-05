const path = require('path')

const deep = require('@magic/deep')

const { fs } = require('../../lib')
const builtinModules = require('../../modules')

const globals = async () => {
  global.keys = global.keys || new Set()
  global.LIB = global.LIB || {}

  Object.entries(builtinModules).forEach(([name, value]) => {
    global.keys.add(name)
    global[name] = value
  })

  const maybeAssetFile = path.join(config.DIR.ASSETS, 'index.js')
  if (await fs.exists(maybeAssetFile)) {
    const assets = require(maybeAssetFile)
    Object.entries(assets).forEach(([name, value]) => {
      global.keys.add(name)
      global[name] = value
    })
  }

  const findInstalledModules = async () => {
    if (await fs.exists(config.DIR.ASSETS)) {
      const assetModules = await fs.readdir(config.DIR.ASSETS)
      // console.log({ assetModules })
    }

    const nodeModules = await fs.readdir(path.join(process.cwd(), 'node_modules', '@magic-modules'))
    nodeModules
      .forEach(nodeModule => {
        // console.log({ nodeModule })
      })
  }

  await findInstalledModules()
}

module.exports = globals