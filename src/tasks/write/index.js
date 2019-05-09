const path = require('path')

const is = require('@magic/types')

const { mkdirp, fs, getFileType } = require('../../lib')
const minifyImages = require('./lib/minifyImages')
const { compress, writeFile, writeServer } = require('./lib')

const isProd = config.ENV === 'production'

const hasFileChanged = async ([name, content]) => {
  const stat = await fs.stat(path.join(config.DIR.PUBLIC, name))
  if (stat.size !== buffer.length) {
    return true
  }

  const oldContent = await fs.readFile(path.join(config.DIR.PUBLIC, name))
  return !is.deep.equal(content, oldContent)
}

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
      .map(async file => {
        const hasChanged = await hasFileChanged(file)
        if (hasChanged) {
          await writeFile(file)
        }
      }),
  )

  pages.forEach(async page => {
    const dir = path.dirname(page.path)
    await mkdirp(dir)
    await fs.writeFile(page.path, page.rendered)
  })

  const jsFile = path.join(config.DIR.PUBLIC, `${config.CLIENT_LIB_NAME}.js`)

  await fs.writeFile(jsFile, client.bundle)

  const usedCss = isProd ? css.minified : css.css
  await fs.writeFile(path.join(config.DIR.PUBLIC, `${config.CLIENT_LIB_NAME}.css`), usedCss)

  if (isProd) {
    await compress(zippable, images)
    await minifyImages(images)
  }

  await writeServer(app)
}

module.exports = write
