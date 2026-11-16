import path from 'path'

import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'

import { saveImport } from '../../../lib/index.mjs'

/**
 * @param {string} dir
 * @returns {Promise<Record<string, unknown>>}
 */
export const findLocalModules = async dir => {
  /** @type {Record<string, unknown>} */
  const modules = {}

  const assetModules = await fs.getFiles(dir)
  const assetPromises = assetModules
    .filter(m => is.case.upper(path.basename(m)[0]))
    .filter(m => ['.mjs', '.js'].some(ext => m.endsWith(ext)))
    .map(async m => {
      try {
        const name = path.basename(m).replace(path.extname(m), '')

        const mod = await saveImport(m)
        if (mod instanceof Error) {
          const stack = mod.stack ? mod.stack.split('at') : []
          log.error('Error', `requiring local magic-module: ${m}, error:`, stack[0], stack[1])
          return
        }
        if (mod.default) {
          modules[name] = mod.default
        } else if (is.fn(mod)) {
          modules[name] = mod
        } else {
          modules[name] = { ...mod }
        }
      } catch (e) {
        const stack = e instanceof Error && e.stack ? e.stack.split('at') : []
        log.error('Error', `requiring local magic-module: ${m}, error:`, stack[0], stack[1])
      }
    })

  await Promise.all(assetPromises)

  return modules
}
