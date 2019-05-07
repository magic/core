const path = require('path')

const deep = require('@magic/deep')
const is = require('@magic/types')
const log = require('@magic/log')

const { getDirectories, getFiles, isUpperCase, toPascal } = require('../../lib')
const builtinModules = require('../../modules')

const findNodeModules = async () => {
  let modules = {}

  const nodeModuleDir = path.join(process.cwd(), 'node_modules', '@magic-modules')
  const nodeModules = await getDirectories([nodeModuleDir], false)
  nodeModules
    .filter(n => nodeModuleDir !== n)
    .forEach(nodeModule => {
      if (nodeModuleDir !== nodeModule) {
        try {
          const name = toPascal(path.basename(nodeModule))
          const mod = require(nodeModule)
          modules[name] = mod
        } catch (e) {
          log.error('Error', `requiring node_module: ${nodeModule}, error: ${e.message}`)
        }
      }
    })
  return modules
}

const findInstalledModules = async () => {
  let modules = {}

  const assetModules = await getFiles(config.DIR.ASSETS)
  assetModules
    .filter(m => isUpperCase(path.basename(m)))
    .forEach(m => {
      try {
        const mod = require(m)
        const name = path.basename(m).replace(path.extname(m), '')
        modules[name] = mod
      } catch (e) {
        log.error('Error' `requiring local magic-module: ${m}, error: ${e.message}`)
      }
    })
  return modules
}

const findAssetFile = () => {
  try {
    const maybeAssetFile = path.join(config.DIR.ASSETS, 'index.js')
    const assets = require(maybeAssetFile)
    let modules = {}
    Object.entries(assets).forEach(([name, mod]) => {
      modules[name] = mod
    })
    return modules
  } catch (e) {
    // we are happy without assetfile
  }
}

const findBuiltins = () => {
  let modules = {}
  Object.entries(builtinModules).forEach(([name, mod]) => {
    // tags are and object that duplicates the tags, unneeded
    if (name !== 'tags') {
      modules[name] = mod
    }
  })
  return modules
}

const findLib = ([name, mod]) => {
  let lib = {}
  if (mod.lib) {
    lib = deep.merge(lib, mod.lib)
  }

  const views = Object.entries(mod).filter(([n]) => isUpperCase(n))
  views.forEach(([n, m]) => {
    lib = deep.merge(findLib([n, m]))
  })

  return lib
}

const findLibs = modules =>
  Object.entries(modules)
    .map(findLib)
    .filter(a => !is.empty(a))

const globals = async app => {
  global.keys = global.keys || new Set()
  global.LIB = global.LIB || {}

  let modules = {}

  modules = deep.merge(modules, await findBuiltins(modules))
  modules = deep.merge(modules, await findAssetFile(modules))
  modules = deep.merge(modules, await findInstalledModules(modules))
  modules = deep.merge(modules, await findNodeModules(modules))

  let lib = app.lib

  Object.entries(modules).forEach(([name, mod]) => {
    global[name] = mod

    const views = Object.entries(mod).filter(([k]) => isUpperCase(k))
    views.forEach(([k, v]) => {
      global[name][k] = v
    })
  })

  const libs = await findLibs(modules)
  libs.forEach(l => {
    Object.entries(l).forEach(([name, value]) => {
      lib[name] = value
    })
  })

  Object.entries(lib).forEach(([name, impl]) => {
    global.LIB[name] = require(impl)
  })

  return {
    modules,
    lib,
  }
}

module.exports = globals
