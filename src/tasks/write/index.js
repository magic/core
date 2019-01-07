const path = require('path')
const zip = require('node-zopfli-es')
const log = require('@magic/log')

const { mkdirp, fs } = require('../../lib')

const isProd = process.env.NODE_ENV === 'production'

const minifyImages = require('./images')

const writeFile = require('./writeFile')

const write = async app => {
  try {
    const { css, lib, pages, static } = app
    await mkdirp(config.DIR.PUBLIC)

    // write static first to make sure all other files below get written
    // even if there is a name clash
    await Promise.all(Object.entries(static).map(writeFile))

    pages.forEach(async page => {
      const dir = path.dirname(page.path)
      await mkdirp(dir)
      await fs.writeFile(page.path, page.rendered)
    })

    const jsFile = path.join(config.DIR.PUBLIC, 'magic.js')
    await fs.writeFile(jsFile, lib.bundle.code)

    await fs.writeFile(path.join(config.DIR.PUBLIC, 'magic.css'), isProd ? css.css : css.minified)

    if (isProd) {
      const zipped = await zip.gzip(lib.bundle.code)
      await fs.writeFile(`${jsFile}.gz`, zipped)

      await minifyImages()
    }
  } catch (e) {
    log.error('tasks/write', e)
  }
}

module.exports = write
