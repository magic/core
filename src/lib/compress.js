const log = require('@magic/log')
const fs = require('./fs')
const getFiles = require('./getFiles')
const getFileType = require('./getFileType')

// both zip and compress get overwritten if node-zopfli-es exists
let zip
let compress = () =>
  log.warn(
    'node-zopfli-es is not installed.',
    `
Magic will continue happily, but none of your files will be minified.
to fix this, please run

npm install node-zopfli-es

this needs xcode on macos, which might be the reason you see this error.
`,
  )

try {
  zip = require('node-zopfli-es')
} catch (e) {}

if (zip) {
  compress = async (zippable, images) => {
    const files = await getFiles(config.DIR.PUBLIC)
    await Promise.all(
      files
        .filter(file => zippable.includes(getFileType(file)))
        .filter(file => !images.includes(getFileType(file)))
        .map(async file => {
          const fileContent = await fs.readFile(file)
          const zipped = await zip.gzip(fileContent)
          await fs.writeFile(`${file}.gz`, zipped)
        }),
    )
  }
}

module.exports = compress
