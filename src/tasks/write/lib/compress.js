const path = require('path')
const zip = require('node-zopfli-es')

const { getFiles, fs, getFileType } = require('../../../lib')

const compress = async (zippable, images) =>
  await Promise.all(
    (await getFiles(config.DIR.PUBLIC))
      .filter(file => zippable.includes(getFileType(file)))
      .filter(file => !images.includes(getFileType(file)))
      .map(async file => {
        const fileContent = await fs.readFile(file)
        const zipped = await zip.gzip(fileContent)
        await fs.writeFile(`${file}.gz`, zipped)
      }),
  )

module.exports = compress
