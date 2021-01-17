import path from 'path'

import fs from '@magic/fs'

import { writeFile } from '../../lib/index.mjs'

import { writeServer } from './writeServer.mjs'

export const write = async app => {
  const { IS_PROD } = config
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

        const extname = path.extname(name)
        // do not write file if extension or filepath is in ignore list.
        if (config.IGNORED_STATIC.includes(extname) || config.IGNORED_STATIC.includes(name)) {
          return
        }

        const dir = path.join(config.DIR.PUBLIC, path.dirname(name))
        await fs.mkdirp(dir)
        await writeFile(file)
      }),
  )

  const pagePromises = pages.map(async page => {
    const oldHash = config.HASHES[page.name]
    if (oldHash && oldHash === page.hash) {
      return
    }

    const pagePath = page.path.replace(config.WEB_ROOT, `${config.DIR.PUBLIC}/`)

    const dir = path.dirname(pagePath)
    await fs.mkdirp(dir)

    await fs.writeFile(pagePath, page.rendered)
  })

  await Promise.all(pagePromises)

  const jsFile = path.join(config.DIR.PUBLIC, `${config.CLIENT_LIB_NAME}.js`)
  await fs.writeFile(jsFile, client)

  const cssFile = path.join(config.DIR.PUBLIC, `${config.CLIENT_LIB_NAME}.css`)
  const usedCss = IS_PROD ? css.minified : css.css
  await fs.writeFile(cssFile, usedCss)

  // const serviceWorkerFile = path.join(config.DIR.PUBLIC, `${config.CLIENT_SERVICE_WORKER_NAME}.js`)
  // await fs.writeFile(serviceWorkerFile, app.sw)

  await writeServer(app)
}

export default write
