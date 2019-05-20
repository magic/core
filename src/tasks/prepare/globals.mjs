import path from 'path'

import deep from '@magic/deep'
import is from '@magic/types'
import log from '@magic/log'

import { fs, getDirectories, getFiles, isUpperCase, toPascal } from '../../lib/index.mjs'

import { builtins, component, tags } from '../../modules/index.mjs'

const localLibIndexPath = path.join('src', 'lib', 'index.mjs')

export const findNodeModules = async () => {
  let modules = {}

  const nodeModuleDir = path.join(process.cwd(), 'node_modules')

  const recursiveSearch = false


  const dirs = await getDirectories(nodeModuleDir, recursiveSearch)
  const dirPromises = dirs
    .filter(dir => dir.includes('magic-module-'))
    .map(async nodeModule => {
      const name = toPascal(nodeModule.split('magic-module-')[1])
      const loadPath = nodeModule.replace(`${nodeModuleDir}/`, '')

      // find module itself
      try {
        const mod = await import(loadPath)
        // copy the imported module into a new object to be able to extend it below
        modules[name] = {
          ...mod,
        }
      } catch (e) {
        log.error('Error', `requiring node_module: ${nodeModule}, error: ${e.message}`)
      }

      // find lib file of module if it exists
      const libPath = path.join(nodeModule, localLibIndexPath)
      const exists = await fs.exists(libPath)
      if (exists) {
        modules[name].lib = path.join(loadPath, localLibIndexPath)
      }
    })

  await Promise.all(dirs)

  const magicModuleDir = path.join(nodeModuleDir, '@magic-modules')
  const nodeModules = await getDirectories(magicModuleDir, recursiveSearch)

  const modulePromises = nodeModules
    .filter(n => nodeModuleDir !== n)
    .map(async nodeModule => {
      if (magicModuleDir !== nodeModule) {
        const name = toPascal(path.basename(nodeModule))
        const loadPath = nodeModule.replace(`${nodeModuleDir}/`, '')

        try {
          const mod = await import(loadPath)
          // copy the imported module into a new object to be able to extend it below
          modules[name] = {
            ...mod,
          }
        } catch (e) {
          log.error('Error', `requiring node_module: ${nodeModule}, error: ${e.message}`)
        }

        const libPath = path.join(nodeModule, localLibIndexPath)
        const exists = await fs.exists(libPath)
        if (exists) {
          modules[name].lib = path.join(loadPath, localLibIndexPath)
        }
      }
    })

  await Promise.all([...dirPromises, ...modulePromises])

  return modules
}

export const findLocalModules = async () => {
  let modules = {}

  const assetModules = await getFiles(config.DIR.ASSETS)
  const assetPromises = assetModules
    .filter(m => isUpperCase(path.basename(m)))
    .filter(m => ['.mjs'].some(ext => m.endsWith(ext)))
    .map(async m => {
      try {
        const name = path.basename(m).replace(path.extname(m), '')
        const mod = await import(m)
        if (mod.default) {
          modules[name] = mod.default
        } else if (is.fn(mod)) {
          modules[name] = mod
        } else {
          modules[name] = { ...mod }
        }

        const libPath = path.join(path.dirname(m), localLibIndexPath)
        const exists = await fs.exists(libPath)
        if (exists) {
          modules[name].lib = path.join(libPath)
        }

      } catch (e) {
        log.error('Error', `requiring local magic-module: ${m}, error: ${e.message}`)
      }
    })

  await Promise.all(assetPromises)
  return modules
}

export const findAssetFile = async () => {
  try {
    const maybeAssetFile = path.join(config.DIR.ASSETS, 'index.mjs')
    const assets = await import(maybeAssetFile)
    let modules = {}
    Object.entries(assets).forEach(([name, mod]) => {
      if (is.fn(mod)) {
        modules[name] = mod
      } else {
        modules[name] = { ...mod }
      }
    })
    return modules
  } catch (e) {
    // we are happy without assetfile
  }
  return {}
}

export const findBuiltins = () => {
  let modules = {}
  Object.entries(builtins).forEach(([name, mod]) => {
    modules[name] = mod
  })
  Object.entries(tags).forEach(([name, mod]) => {
    modules[name] = mod
  })

  modules.component = component
  return modules
}

export const prepareGlobals = async app => {
  global.keys = global.keys || new Set()

  let modules = {}

  const builtinFiles = await findBuiltins(modules)
  if (builtinFiles) {
    modules = deep.merge(modules, builtinFiles)
  }
  const assetFiles = await findAssetFile(modules)
  if (assetFiles) {
    modules = deep.merge(modules, assetFiles)
  }
  const localModuleFiles = await findLocalModules(modules)
  if (localModuleFiles) {
    modules = deep.merge(modules, { ...localModuleFiles })
  }
  const nodeModuleFiles = await findNodeModules(modules)
  if (nodeModuleFiles) {
    modules = deep.merge(modules, nodeModuleFiles)
  }

  Object.entries(modules).forEach(([name, mod]) => {
    if (is.fn(mod)) {
      global[name] = mod
    } else if (is.fn(mod.View)) {
      global[name] = mod.View
    } else if (is.fn(mod[name])) {
      global[name] = mod[name]
    }

    const views = Object.entries(mod).filter(([k]) => k !== name && isUpperCase(k) && k !== 'View')
    views.forEach(([k, v]) => {
      if (is.function(v)) {
        global[name][k] = v
      } else {
        global[name][k] = v.View
      }
    })
  })

  const libPaths = {}

  Object.entries(modules)
    .filter(([_, { lib }]) => lib)
    .forEach(([name, { lib }]) => {
      libPaths[name] = lib
    })

  try {
    const indexLibPath = path.join(config.ROOT, 'assets', 'lib', 'index.mjs')
    const indexLib = await import(indexLibPath)
    Object.entries(indexLib).forEach(async ([name, value]) => {
      libPaths[name] = path.join(path.dirname(indexLibPath), value)
    })

    Object.entries(app.lib).forEach(([name, libFile]) => {
      libPaths[name] = path.join(path.dirname(indexLibPath), libFile)
    })
  } catch (e) {
    // we do not require a lib file to exist
  }

  const libFns = {}

  const libPromises = Object.entries(libPaths).map(async ([name, libPath]) => {
    const { default: lib, ...mainLib } = await import(libPath)
    if (!lib) {
      libFns[name] = mainLib
    } else {
      libFns[name] = lib
    }
  })

  await Promise.all(libPromises)

  global.LIB = libFns

  return {
    modules,
    lib: libPaths,
  }
}
