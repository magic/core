const path = require('path')
const log = require('@magic/log')

const { mkdirp, fs } = require('../../lib')

const isProd = process.env.NODE_ENV === 'production'

const minifyImages = require('./images')

const writeFile = require('./writeFile')
const compress = require('./compress')
const { getFileType } = require('../../lib/')

const zippable = config.FILETYPES.ZIPPABLE
const images = config.FILETYPES.IMAGES

const write = async app => {
  const { css, lib, pages, static } = app
  await mkdirp(config.DIR.PUBLIC)

  // write static first to make sure all other files below get written
  // even if there is a name clash
  await Promise.all(Object.entries(static)
    .filter(([name]) => !images.includes(getFileType(name)))
    .map(async file => await writeFile(file))
  )

  pages.forEach(async page => {
    const dir = path.dirname(page.path)
    await mkdirp(dir)
    await fs.writeFile(page.path, page.rendered)
  })

  const jsFile = path.join(config.DIR.PUBLIC, 'magic.js')
  await fs.writeFile(jsFile, lib.bundle.code)

  await fs.writeFile(path.join(config.DIR.PUBLIC, 'magic.css'), isProd ? css.css : css.minified)

  if (isProd) {
    await compress(zippable, images)
    await minifyImages(images)
  }
}

module.exports = write
