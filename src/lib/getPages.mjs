import path from 'path'

import log from '@magic/log'
import fs from '@magic/fs'

export const getPages = async () => {
  try {
    const files = await fs.getFiles(config.DIR.PAGES)
    if (files.length === 0) {
      throw new Error('no files')
    }

    return files
  } catch (e) {
    if (config.DIR.PAGES.startsWith(process.cwd())) {
      throw new Error(`NOEXIST - ${config.DIR.PAGES} does not exist or does not contain pages`)

      // TODO: automatically install an example and give the user a choice which one
      // const indexPage = "() => div('hello world')"
      // const pagePath = path.join(config.DIR.PAGES, 'index.mjs')
      // await fs.mkdirp(config.DIR.PAGES)
      // await fs.writeFile(pagePath, indexPage)
      //~ return await getPages()
    }

    throw e
  }
}
