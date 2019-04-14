const path = require('path')

const { mkdirp, fs, getFileType } = require('../../lib')

const isProd = process.env.NODE_ENV === 'production'

const minifyImages = require('./lib/minifyImages')

const { compress, writeFile, writeServer } = require('./lib')

const write = async app => {
  const zippable = config.FILETYPES.ZIPPABLE
  const images = config.FILETYPES.IMAGES

  const { css, client, pages, static } = app
  await mkdirp(config.DIR.PUBLIC)

  // write static first to make sure all other files below get written
  // even if there is a name clash
  await Promise.all(
    Object.entries(static)
      .filter(([name]) => !images.includes(getFileType(name)))
      .map(async file => await writeFile(file)),
  )

  pages.forEach(async page => {
    const dir = path.dirname(page.path)
    await mkdirp(dir)
    await fs.writeFile(page.path, page.rendered)
  })

  const jsFile = path.join(config.DIR.PUBLIC, `${config.LIB_NAME}.js`)

  await fs.writeFile(jsFile, client.bundle)

  const usedCss = isProd ? css.minified : css.css
  await fs.writeFile(path.join(config.DIR.PUBLIC, `${config.LIB_NAME}.css`), usedCss)

  if (isProd) {
    await compress(zippable, images)
    await minifyImages(images)
  }

  await writeServer(app)
}

module.exports = write
