import path from 'path'

import fs from '@magic/fs'

import { writeFile } from '../../lib/index.mjs'

import { writeServer } from './writeServer.mjs'

export const write = async (app, config) => {
  const {
    DIR,
    CLIENT_LIB_NAME,
    // CLIENT_SERVICE_WORKER_NAME,
    // FILETYPES,
    HASHES,
    IGNORED_STATIC,
    IS_PROD,
    WEB_ROOT,
  } = config
  // const zippable =FILETYPES.ZIPPABLE
  // const images = FILETYPES.IMAGES

  const { css, client, pages, static: stat } = app
  await fs.mkdirp(DIR.PUBLIC)

  // write static first to make sure all other files below get written
  // even if there is a name clash
  await Promise.all(
    Object.entries(stat)
      // .filter(([name]) => !images.includes(getFileType(name)))
      .map(async file => {
        const [name] = file

        const extname = path.extname(name)
        // do not write file if extension or filepath is in ignore list.
        if (IGNORED_STATIC.includes(extname) || IGNORED_STATIC.includes(name)) {
          return
        }

        const dir = path.join(DIR.PUBLIC, path.dirname(name))
        await fs.mkdirp(dir)
        await writeFile(file, config)
      }),
  )

  const pagePromises = pages.map(async page => {
    const oldHash = HASHES[page.name]
    if (oldHash && oldHash === page.hash) {
      return
    }

    const pagePath = page.path.replace(WEB_ROOT, `${DIR.PUBLIC}/`)

    const dir = path.dirname(pagePath)
    await fs.mkdirp(dir)

    await fs.writeFile(pagePath, page.rendered)
  })

  await Promise.all(pagePromises)

  const jsFile = path.join(DIR.PUBLIC, `${CLIENT_LIB_NAME}.js`)
  await fs.writeFile(jsFile, client)

  const cssFile = path.join(DIR.PUBLIC, `${CLIENT_LIB_NAME}.css`)
  const usedCss = IS_PROD ? css.minified : css.css
  await fs.writeFile(cssFile, usedCss)

  // const serviceWorkerFile = path.join(DIR.PUBLIC, `${CLIENT_SERVICE_WORKER_NAME}.js`)
  // await fs.writeFile(serviceWorkerFile, app.sw)

  await writeServer(app)
}

export default write
