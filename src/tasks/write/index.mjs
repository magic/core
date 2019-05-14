import path from 'path'

const {
  minifyImages,
  compress,
  writeFile,
  writeServer,
  mkdirp,
  fs,
  getFileType,
} = require('../../lib')

const isProd = config.ENV === 'production'

const write = async app => {
  const zippable = config.FILETYPES.ZIPPABLE
  const images = config.FILETYPES.IMAGES


  const { css, client, pages, static: stat } = app
  await mkdirp(config.DIR.PUBLIC)

  // write static first to make sure all other files below get written
  // even if there is a name clash
  await Promise.all(
    Object.entries(stat)
      .filter(([name]) => !images.includes(getFileType(name)))
      .map(async file => {
        await writeFile(file)
      }),
  )

  pages.forEach(async page => {
    const oldHash = config.HASHES.pages[page.name]
    if (oldHash === page.hash) {
      return
    }

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

export default write
