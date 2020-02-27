import path from 'path'

import cases from '@magic/cases'
import deep from '@magic/deep'
import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'

import { builtins, component, tags } from '../../modules/index.mjs'
import { replacePathSepForImport } from '../../lib/index.mjs'

const url = new URL(import.meta.url)
const dirName = path.dirname(url.pathname)

const localLibIndexPath = path.join('src', 'lib', 'index.mjs')
const localLibMjsPath = path.join('src', 'lib.mjs')
const nodeModuleDir = path.join(process.cwd(), 'node_modules')
const recursiveSearch = false

export const findNodeModules = async () => {
  let modules = {}

  const dirs = await fs.getDirectories(nodeModuleDir, recursiveSearch)

  const dirPromises = dirs
    .filter(dir => dir.includes('magic-module-') || dir.includes('magic-modules-'))
    .map(async nodeModule => {
      const name = cases.pascal(nodeModule.split(/magic-module(s)?/)[1])
      const importDir = nodeModule.replace(nodeModuleDir + path.sep, '')
      const loadPath = replacePathSepForImport(importDir, path.sep)

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
      } catch (e) {
        if (e.code !== 'ENOENT') {
          throw error(e)
        }
      }

      try {
        const libMjsPath = path.join(nodeModule, localLibMjsPath)
        await fs.stat(libMjsPath)
        modules[name].lib = path.join(loadPath, localLibMjsPath)
      } catch (e) {
        if (e.code !== 'ENOENT') {
          throw error(e)
        }
      }
    })

  const magicModuleDir = path.join(nodeModuleDir, '@magic-modules')
  const nodeModules = await fs.getDirectories(magicModuleDir, recursiveSearch)

  const modulePromises = nodeModules
    .filter(n => nodeModuleDir !== n)
    .map(async nodeModule => {
      if (magicModuleDir !== nodeModule) {
        const name = cases.pascal(path.basename(nodeModule))

        const importPath = nodeModule.replace(nodeModuleDir + path.sep, '')
        const loadPath = replacePathSepForImport(importPath, path.sep)

        try {
          const mod = await import(loadPath)
          // copy the imported module into a new object to be able to extend it below
          modules[name] = {
            ...mod,
          }
        } catch (e) {
          log.error('E_REQUIRE', `requiring node_module: ${nodeModule}, error: ${e.message}`)
          process.exit(1)
        }

        try {
          const libPath = path.join(nodeModule, localLibIndexPath)
          await fs.stat(libPath)
          const importPath = path.join(loadPath, localLibIndexPath)
          const resolvedLibPath = replacePathSepForImport(importPath, path.sep)
          modules[name].lib = resolvedLibPath
        } catch (e) {
          if (e.code !== 'ENOENT') {
            throw error(e)
          }
        }

        try {
          const libMjsPath = path.join(nodeModule, localLibMjsPath)
          await fs.stat(libMjsPath)
          modules[name].lib = path.join(loadPath, localLibMjsPath)
        } catch (e) {
          if (e.code !== 'ENOENT') {
            throw error(e)
          }
        }
      }
    })

  await Promise.all([...dirPromises, ...modulePromises])

  return modules
}

export const findLocalModules = async () => {
  let modules = {}

  const assetModules = await fs.getFiles(config.DIR.ASSETS)
  const assetPromises = assetModules
    .filter(m => is.case.upper(path.basename(m)[0]))
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
  let libOfficialNodeModuleFiles = await fs.getDirectories(libNodeModuleDir, recursiveSearch)
  libOfficialNodeModuleFiles = libOfficialNodeModuleFiles.filter(n => n !== libNodeModuleDir)

  const nodeModules = await fs.getDirectories(nodeModuleDir, recursiveSearch)
  const libInofficialNodeModuleFiles = nodeModules.filter(
    n => n.includes('magic-library-') || n.includes('magic-libraries-'),
  )

  const libDirs = [...libOfficialNodeModuleFiles, ...libInofficialNodeModuleFiles]

  const libPromises = libDirs.map(async libDir => {
    let libName = ''
    if (libDir.includes('@magic-libraries')) {
      libName = libDir.split('@magic-libraries' + path.sep)[1]
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

const findThemeModules = async (modules = {}) => {
  let { THEME } = config

  if (THEME) {
    if (is.string(THEME)) {
      THEME = [THEME]
    }

    const results = await Promise.all(
      THEME.map(async theme_name => {
        // order is meaningful.
        const themeLocations = [
          // first look if we have this theme preinstalled in @magic, if so, merge it into the styles
          path.join(dirName, '..', '..', 'themes', theme_name, 'index.mjs'),
          // see if the theme is a full name of a js module in node_modules,
          // eg: @org/theme-name or theme-name
          theme_name,
          // see if this is a @magic-themes theme
          `@magic-themes/${theme_name}`,
          // see if it is installed locally.
          path.join(config.DIR.THEMES, theme_name, 'index.mjs'),
        ]

        const modules = {}

        await Promise.all(
          themeLocations.map(async location => {
            try {
              const { default: theme, ...maybeModules } = await import(location)

              const libs = {}
              Object.entries(maybeModules).map(([name, fn]) => {
                if (is.fn(fn)) {
                  if (!modules[name]) {
                    modules[name] = fn
                  } else if (modules[name].View) {
                    modules[name] = {
                      ...modules[name],
                      View: fn,
                    }
                  } else {
                    modules[name] = fn
                  }
                } else if (is.object(fn)) {
                  if (name[0].toUpperCase === name[0].toUpperCase()) {
                    if (!modules[name]) {
                      modules[name] = { ...fn }
                    } else if (is.fn(modules[name])) {
                      modules[name] = { View: modules[name], ...fn }
                    } else {
                      modules[name] = {
                        ...modules[name],
                        ...fn,
                      }
                    }
                  }
                }
              })
            } catch (e) {
              if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
                throw error(e)
              }
            }
          }),
        )

        return modules
      }),
    )

    // by writing the results after awaiting them above,
    // we force correct order of merges.
    // Promise.all does not wait internally for sequential execution,
    // but await Promise.all returns ordered results.
    results.map(result => {
      modules = deep.merge(modules, result)
    })
  }

  return modules
}

export const prepareGlobals = async (app, config) => {
  global.keys = global.keys || new Set()
  global.config = config
  global.app = app

  let modules = {}

  // load core builtin modules
  const builtinFiles = await findBuiltins(modules)
  if (builtinFiles) {
    modules = deep.merge(modules, builtinFiles)
  }

  // load modules from themes
  modules = await findThemeModules(modules)

  // load plugins from node_modules
  const nodeModuleFiles = await findNodeModules(modules)
  if (nodeModuleFiles) {
    modules = deep.merge(modules, nodeModuleFiles)
  }

  // look for /assets/index.mjs
  const assetFile = await findAssetFile(modules)
  if (assetFile) {
    modules = deep.merge(modules, assetFile)
  }

  // look for /assets/Uppercased.mjs and /assets/modules/Uppercased.mjs
  const localModuleFiles = await findLocalModules(modules)
  if (localModuleFiles) {
    modules = deep.merge(modules, { ...localModuleFiles })
  }

  Object.entries(modules).forEach(([name, mod]) => {
    if (is.fn(mod)) {
      global[name] = mod
    } else if (is.fn(mod.View)) {
      global[name] = mod.View
    } else if (is.fn(mod[name])) {
      global[name] = mod[name]
    }

    const views = Object.entries(mod).filter(
      ([k]) => k !== name && is.case.upper(k[0]) && k !== 'View',
    )
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
