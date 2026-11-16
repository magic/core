import path from 'path'

import is from '@magic/types'

import { saveImport } from '../../../lib/index.mjs'

/**
 * @param {string} dir
 * @returns {Promise<Record<string, unknown>>}
 */
export const findAssetFile = async dir => {
  try {
    const maybeAssetFile = path.join(dir, 'index.mjs')
    const assets = await saveImport(maybeAssetFile)
    /** @type {Record<string, unknown>} */
    const modules = {}
    if (!(assets instanceof Error)) {
      Object.entries(assets).forEach(([name, mod]) => {
        if (is.fn(mod)) {
          modules[name] = mod
        } else if (is.objectNative(mod)) {
          modules[name] = { ...mod }
        }
      })
    }
    return modules
  } catch {
    // we are happy without assetfile
  }
  return {}
}
