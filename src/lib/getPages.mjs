import error from '@magic/error'
import fs from '@magic/fs'

export const getPages = async () => {
  try {
    const files = await fs.getFiles(config.DIR.PAGES)
    if (files.length === 0) {
      // this actually throws the error below
      throw new Error('no files')
    }

    return files
  } catch (e) {
    if (config.DIR.PAGES.startsWith(config.ROOT)) {
      throw error(
        `${config.DIR.PAGES} does not exist or does not contain pages`,
        'E_PAGE_DIR_NOEXIST',
      )

      // TODO: install an example and give the user a choice which one
      // const indexPage = "() => div('hello world')"
      // const pagePath = path.join(config.DIR.PAGES, 'index.mjs')
      // await fs.mkdirp(config.DIR.PAGES)
      // await fs.writeFile(pagePath, indexPage)
      //~ return await getPages()
    }

    throw error(e)
  }
}
