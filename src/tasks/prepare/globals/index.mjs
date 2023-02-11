import deep from '@magic/deep'

import is from '@magic/types'

import { findNodeModules } from './findNodeModules.mjs'
import { findLocalModules } from './findLocalModules.mjs'
import { findAssetFile } from './findAssetFile.mjs'
import { findBuiltins } from './findBuiltins.mjs'
import { findLibraries } from './findLibraries.mjs'
import { findThemes } from './findThemes.mjs'
import { registerModule } from './registerModule.mjs'

export const prepareGlobals = async (app, config) => {
  global.app = app

  const { DIR, NODE_MODULES, ROOT, THEME } = config

  let modules = {}

  // load core builtin modules
  const builtinFiles = await findBuiltins(modules)
  if (builtinFiles) {
    modules = deep.merge(modules, builtinFiles)
    Object.entries(builtinFiles).map(registerModule)
  }

  // load modules from themes
  const themeModulefiles = await findThemes(modules, { DIR, NODE_MODULES, THEME })
  if (themeModulefiles) {
    modules = deep.merge(modules, themeModulefiles)
    Object.entries(themeModulefiles).map(registerModule)
  }

  // load plugins from node_modules
  const nodeModuleFiles = await findNodeModules(modules)
  if (nodeModuleFiles) {
    modules = deep.merge(modules, nodeModuleFiles)
    Object.entries(nodeModuleFiles).map(registerModule)
  }

  // look for /assets/index.mjs
  const assetFile = await findAssetFile(DIR.ASSETS)
  if (assetFile) {
    modules = deep.merge(modules, assetFile)
    Object.entries(assetFile).map(registerModule)
  }

  // look for /assets/Uppercased.mjs and /assets/modules/Uppercased.mjs
  const localModuleFiles = await findLocalModules(DIR.ASSETS)
  if (localModuleFiles) {
    modules = deep.merge(modules, localModuleFiles)
    Object.entries(localModuleFiles).map(registerModule)
  }

  // Object.entries(modules).forEach(registerModule)

  const libs = await findLibraries(app, modules, { DIR, ROOT })

  return {
    modules,
    libs,
  }
}
