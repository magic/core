import deep from '@magic/deep'

import is from '@magic/types'

import { findNodeModules } from './findNodeModules.mjs'
import { findLocalModules } from './findLocalModules.mjs'
import { findAssetFile } from './findAssetFile.mjs'
import { findBuiltins } from './findBuiltins.mjs'
import { findLibraries } from './findLibraries.mjs'
import { findThemes } from './findThemes.mjs'

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
  modules = await findThemes(modules)

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

  const libs = await findLibraries(app, modules)

  return {
    modules,
    libs,
  }
}
