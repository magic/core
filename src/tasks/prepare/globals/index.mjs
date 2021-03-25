import deep from '@magic/deep'

import is from '@magic/types'

import { findNodeModules } from './findNodeModules.mjs'
import { findLocalModules } from './findLocalModules.mjs'
import { findAssetFile } from './findAssetFile.mjs'
import { findBuiltins } from './findBuiltins.mjs'
import { findLibraries } from './findLibraries.mjs'
import { findThemes } from './findThemes.mjs'

export const prepareGlobals = async (app, config) => {
  global.app = app

  let modules = {}

  // load core builtin modules
  const builtinFiles = await findBuiltins(modules)
  if (builtinFiles) {
    modules = deep.merge(modules, builtinFiles)
  }

  // load modules from themes
  const themeModulefiles = await findThemes(modules, config)
  if (themeModulefiles) {
    modules = deep.merge(modules, themeModulefiles)
  }

  // load plugins from node_modules
  const nodeModuleFiles = await findNodeModules(modules)
  if (nodeModuleFiles) {
    modules = deep.merge(modules, nodeModuleFiles)
  }

  // look for /assets/index.mjs
  const assetFile = await findAssetFile(config.DIR.ASSETS)
  if (assetFile) {
    modules = deep.merge(modules, assetFile)
  }

  // look for /assets/Uppercased.mjs and /assets/modules/Uppercased.mjs
  const localModuleFiles = await findLocalModules(config.DIR.ASSETS)
  if (localModuleFiles) {
    modules = deep.merge(modules, localModuleFiles)
  }
  Object.entries(modules).forEach(([name, mod]) => {
    // console.log({ name, mod })
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
