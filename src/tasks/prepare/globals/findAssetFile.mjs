import path from 'path'

import is from '@magic/types'

import { saveImport } from '../../../lib/index.mjs'

export const findAssetFile = async dir => {
  try {
    const maybeAssetFile = path.join(dir, 'index.mjs')
    const assets = await saveImport(maybeAssetFile)
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
