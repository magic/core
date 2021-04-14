import path from 'path'

import fs from '@magic/fs'
import log from '@magic/log'

import { replacePathSepForImport } from './replacePathSepForImport.mjs'

export const findConfigFile = async (ROOT, magicConfigNames, oldConfigName) => {
  let filePath

  let configFound = false

  await Promise.all(
    magicConfigNames.map(async name => {
      const fd = path.join(ROOT, name)
      const exists = await fs.exists(fd)

      if (exists) {
        if (configFound) {
          const msg =
            'Found multiple config files. Make sure only one of the following files exist:\n'
          const names = magicConfigNames.map(name => path.join(ROOT, name)).join('\n')

          log.warn('W_MULTI_CONFIG', msg, names, '\n')
        }

        configFound = true
        filePath = replacePathSepForImport(fd)
      }
    }),
  )

  if (!filePath) {
    const oldConfigFd = path.join(ROOT, oldConfigName)
    const oldConfigExists = await fs.exists(oldConfigFd)

    if (oldConfigExists) {
      filePath = replacePathSepForImport(oldConfigFd)

      log.warn(
        'W_OLD_CONFIG',
        'You are using config.mjs, which is the old config. please rename the file to magic.js',
      )
    }
  }

  if (!filePath) {
    log.error(
      'E_NO_CONFIG',
      `No config file found. Please create ${ROOT}/magic.js (https://magic.github.io/core/files/#config)`,
    )
    log(`
Example Config:

export default {
  ROOT: 'src', ${log.paint('green', '// the directory your pages, modules and themes live in')}
  PUBLIC: 'docs', ${log.paint(
    'green',
    '// the output directory, docs gets accepted by github and gitlab pages',
  )}
  THEME: 'example', ${log.paint(
    'green',
    '// the @magic-theme you want to use. needs to be installed.',
  )}
  URL: 'https://example.com', ${log.paint('green', '// the root url of the site')}
  WEB_ROOT: '/', ${log.paint('green', '// gets appended to the URL, should start and end with a /')}
}`)

    process.exit()
  }

  return filePath
}
