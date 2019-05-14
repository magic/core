import path from 'path'

import log from '@magic/log'

import fs from './fs.mjs'
import mkdirp from './mkdirp.mjs'
import getFiles from './getFiles.mjs'

export const getPages = async () => {
  try {
    const files = await getFiles(config.DIR.PAGES)
    if (files.length === 0) {
      throw new Error('no files')
    }
    return files
  } catch (e) {
    if (config.DIR.PAGES.startsWith(process.cwd())) {
      log.warn('NOEXIST', `${config.DIR.PAGES} does not exist or does not contain pages`)
      // const indexPage = "div('hello world')"
      // const pagePath = path.join(config.DIR.PAGES, 'index.js')
      // await mkdirp(config.DIR.PAGES)
      // await fs.writeFile(pagePath, indexPage)
      return await getPages()
    }

    throw e
  }
}

export default getPages
