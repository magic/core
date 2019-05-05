const path = require('path')

const { getDirectories, getFiles, isUpperCase, toPascal } = require('../../lib')
const builtinModules = require('../../modules')

const globals = async () => {
  global.keys = global.keys || new Set()
  global.LIB = global.LIB || {}

  Object.entries(builtinModules).forEach(([name, value]) => {
    global.keys.add(name)
    global[name] = value
  })

  const maybeAssetFile = path.join(config.DIR.ASSETS, 'index.js')
  try {
    const assets = require(maybeAssetFile)
    Object.entries(assets).forEach(([name, value]) => {
      global.keys.add(name)
      global[name] = value
    })
  } catch (e) {
    // we are happy without assetfile
  }

  const findInstalledModules = async () => {
    const assetModules = await getFiles(config.DIR.ASSETS)

    assetModules
      .filter(m => isUpperCase(path.basename(m)))
      .forEach(m => {
        try {
          const mod = require(m)
          const name = path.basename(m).replace(path.extname(m), '')
          global.keys.add(name)
          global[name] = mod
        } catch (e) {
          console.error(`Error requiring local magic-module: ${m}, error: ${e.message}`)
        }
      })

    const nodeModuleDir = path.join(process.cwd(), 'node_modules', '@magic-modules')
    const nodeModules = await getDirectories([nodeModuleDir], false)
    nodeModules.forEach(nodeModule => {
      if (nodeModuleDir !== nodeModule) {
        try {
          const mod = require(nodeModule)

          const name = toPascal(path.basename(nodeModule))
          global.keys.add(name)
          global[name] = mod
        } catch (e) {
          console.error(`Error requiring node_module: ${nodeModule}, error: ${e.message}`)
        }
      }
    })
  }

  await findInstalledModules()
}

module.exports = globals
