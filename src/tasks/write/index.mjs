import path from 'path'

import {
  // compress,
  fs,
  // getFileType,
  // minifyImages,
  writeFile,
  writeServer,
} from '../../lib/index.mjs'

export const write = async app => {
  const { IS_PROD, TMP_DIR } = config
  // const zippable = config.FILETYPES.ZIPPABLE
  // const images = config.FILETYPES.IMAGES

  const { css, client, pages, static: stat } = app
  await fs.mkdirp(config.DIR.PUBLIC)

  // write static first to make sure all other files below get written
  // even if there is a name clash
  await Promise.all(
    Object.entries(stat)
      // .filter(([name]) => !images.includes(getFileType(name)))
      .map(async file => {
        const [name] = file
        const dir = path.join(config.DIR.PUBLIC, path.dirname(name))
        await fs.mkdirp(dir)
        await writeFile(file)
      }),
  )

  pages.forEach(async page => {
    const oldHash = config.HASHES.pages[page.name]
    if (oldHash && oldHash === page.hash) {
      return
    }

    const pagePath = page.path.replace(config.WEB_ROOT, `${config.DIR.PUBLIC}/`)

    const dir = path.dirname(pagePath)
    await fs.mkdirp(dir)

    await fs.writeFile(pagePath, page.rendered)
  })

  const jsFile = path.join(config.DIR.PUBLIC, `${config.CLIENT_LIB_NAME}.js`)
  await fs.writeFile(jsFile, client)

  const cssFile = path.join(config.DIR.PUBLIC, `${config.CLIENT_LIB_NAME}.css`)
  const usedCss = IS_PROD ? css.minified : css.css
  await fs.writeFile(cssFile, usedCss)

  // const serviceWorkerFile = path.join(config.DIR.PUBLIC, `${config.CLIENT_SERVICE_WORKER_NAME}.js`)
  // await fs.writeFile(serviceWorkerFile, app.sw)

  // if (IS_PROD) {
  //   const comp = await compress()
  //   await comp(zippable, images)
  //   await minifyImages(images)
  // }

  await writeServer(app)

  const tmpExists = await fs.exists(TMP_DIR)
  if (tmpExists) {
    await fs.rmrf(TMP_DIR)
  }
}

export default write
