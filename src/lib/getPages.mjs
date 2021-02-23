import error from '@magic/error'
import fs from '@magic/fs'

export const getPages = async ({ dir, root }) => {
  try {
    const files = await fs.getFiles(dir)
    if (files.length === 0) {
      // this actually throws the error below
      throw new Error('no files')
    }

    return files
  } catch (e) {
    if (dir.startsWith(root)) {
      throw error(`${dir} does not exist or does not contain pages`, 'E_PAGE_DIR_NOEXIST')

      // TODO: install an example and give the user a choice which one
      // const indexPage = "() => div('hello world')"
      // const pagePath = path.join(dir, 'index.mjs')
      // await fs.mkdirp(dir)
      // await fs.writeFile(pagePath, indexPage)
      //~ return await getPages()
    }

    throw error(e)
  }
}
