import path from 'path'

import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'

export const findLocalModules = async dir => {
  let modules = {}

  const assetModules = await fs.getFiles(dir)
  const assetPromises = assetModules
    .filter(m => is.case.upper(path.basename(m)[0]))
    .filter(m => ['.mjs', '.js'].some(ext => m.endsWith(ext)))
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
        const stack = e.stack.split('at')
        log.error('Error', `requiring local magic-module: ${m}, error:`, stack[0], stack[1])
      }
    })

  await Promise.all(assetPromises)

  return modules
}
