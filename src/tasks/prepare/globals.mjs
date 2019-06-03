import path from 'path'

import deep from '@magic/deep'
import is from '@magic/types'
import log from '@magic/log'

import { fs, getDirectories, getFiles, isUpperCase, toPascal } from '../../lib/index.mjs'

import { builtins, component, tags } from '../../modules/index.mjs'

const localLibIndexPath = path.join('src', 'lib', 'index.mjs')
const localLibMjsPath = path.join('src', 'lib.mjs')
const nodeModuleDir = path.join(process.cwd(), 'node_modules')
const recursiveSearch = false

export const findNodeModules = async () => {
  let modules = {}

  const dirs = await getDirectories(nodeModuleDir, recursiveSearch)
  const dirPromises = dirs
    .filter(dir => dir.includes('magic-module-') || dir.includes('magic-modules-'))
    .map(async nodeModule => {
      const name = toPascal(nodeModule.split(/magic-module(s)?/)[1])
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
      try {
        const libPath = path.join(nodeModule, localLibIndexPath)
        await fs.stat(libPath)
        modules[name].lib = path.join(loadPath, localLibIndexPath)
      } catch(e) {
        if (e.code !== 'ENOENT') {
          throw e
        }
      }

      try {
        const libMjsPath = path.join(nodeModule, localLibMjsPath)
        await fs.stat(libMjsPath)
        modules[name].lib = path.join(loadPath, localLibMjsPath)
      } catch(e) {
        if (e.code !== 'ENOENT') {
          throw e
        }
      }
    })

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

        try {
          const libPath = path.join(nodeModule, localLibIndexPath)
          await fs.stat(libPath)
          modules[name].lib = path.join(loadPath, localLibIndexPath)
        } catch(e) {
          if (e.code !== 'ENOENT') {
            throw e
          }
        }

        try {
          const libMjsPath = path.join(nodeModule, localLibMjsPath)
          await fs.stat(libMjsPath)
          modules[name].lib = path.join(loadPath, localLibMjsPath)
        } catch(e) {
          if (e.code !== 'ENOENT') {
            throw e
          }
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
  // we do not have to look for libs here,
  // our builtins do not export any.
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

export const findDefinedLibraries = async (app, modules) => {
  const libraries = {}

  if (app.lib) {
    Object.entries(app.lib).forEach(([name, val]) => {
      libraries[name] = path.resolve(val)
    })
  }

  const libNodeModuleDir = path.join(nodeModuleDir, '@magic-libraries')
  let libOfficialNodeModuleFiles = await getDirectories(libNodeModuleDir, recursiveSearch)
  libOfficialNodeModuleFiles = libOfficialNodeModuleFiles.filter(n => n !== libNodeModuleDir)

  const nodeModules = await getDirectories(nodeModuleDir, recursiveSearch)
  const libInofficialNodeModuleFiles = nodeModules.filter(
    n => n.includes('magic-library-') || n.includes('magic-libraries-'),
  )

  const libDirs = [...libOfficialNodeModuleFiles, ...libInofficialNodeModuleFiles]

  const libPromises = libDirs.map(async libDir => {
    let libName = ''
    if (libDir.includes('@magic-libraries')) {
      libName = libDir.split('@magic-libraries/')[1]
      libDir = `@magic-libraries/${libName}`
    } else if (libDir.includes('magic-libraries-')) {
      libName = libDir.split('magic-libraries-')[1]
      libDir = `magic-libraries-${libName}`
    } else if (libDir.includes('magic-library')) {
      libName = libDir.split('magic-library-')[1]
      libDir = `magic-library-${libName}`
    }

    libraries[libName] = libDir
  })

  await Promise.all(libPromises)

  Object.entries(modules).forEach(([key, val]) => {
    key = `${key[0].toLowerCase()}${key.substring(1)}`
    if (val.lib) {
      libraries[key] = val.lib
    }

    Object.entries(val).forEach(([viewKey, view]) => {
      if (view.lib) {
        viewKey = `${viewKey[0].toLowerCase()}${key.substring(1)}`
        libraries[viewKey] = view.lib
      }
    })
  })

  global.lib = global.lib || {}

  const libFnPromises = Object.entries(libraries).map(async ([key, val]) => {
    let lib = await import(val)
    if (lib.default) {
      lib = lib.default
    }

    global.lib[key] = lib

    return {
      key,
      path: val,
      lib,
    }
  })

  const libs = await Promise.all(libFnPromises)

  return libs
}

export const prepareGlobals = async (app, config) => {
  global.keys = global.keys || new Set()
  global.config = config

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

  const libs = await findDefinedLibraries(app, modules)

  return {
    modules,
    libs,
  }
}
