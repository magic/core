const log = require('@magic/log')
const { getFiles, fs, getFileType } = require('../../../lib')

let zip
let compress = () =>
  log.warn(
    'node-zopfli-es is not installed.',
    `
Magic will continue happily, but none of your files will be minified.
to fix this, please run

npm install node-zopfli-es

this needs xcode on macosx, which might be the reason you see this error.
`,
  )

try {
  zip = require('node-zopfli-es')
} catch (e) {}

if (zip) {
  compress = async (zippable, images) =>
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
}

module.exports = compress
