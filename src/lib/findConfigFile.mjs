import path from 'path'

import fs from '@magic/fs'
import log from '@magic/log'
import error from '@magic/error'

import { replacePathSepForImport } from './replacePathSepForImport.mjs'

export const findConfigFile = async (ROOT, magicConfigNames, oldConfigName) => {
  let filePath

  let configFound = false

  await Promise.all(magicConfigNames.map(async name => {
    const fd = path.join(ROOT, name)
    const exists = await fs.exists(fd)

    if (exists) {
      if (configFound) {
        const msg = 'Found multiple config files. Make sure only one of the following files exist:\n'
        const names = magicConfigNames.map(name => path.join(ROOT, name)).join('\n')

        log.warn('W_MULTI_CONFIG', msg, names, '\n')
      }

      configFound = true
      filePath = replacePathSepForImport(fd)
    }
  }))

  if (!filePath) {
    const oldConfigFd = path.join(ROOT, oldConfigName)
    const oldConfigExists = await fs.exists(oldConfigFd)

    if (oldConfigExists) {
      filePath = replacePathSepForImport(oldConfigFd)

      log.warn('W_OLD_CONFIG', 'You are using config.mjs, which is the old config. please rename the file to magic.js')
    }
  }


  if (!filePath) {
    log.error('E_NO_CONFIG', 'No config file found. Please create magic.js (https://magic.github.io/core/files/#config)')
    process.exit()
  }

  return filePath
}
