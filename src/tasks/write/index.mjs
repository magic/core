import path from 'path'

import log from '@magic/log'
import fs from '@magic/fs'

import { writePages } from './pages.mjs'
import { writeStatic } from './static.mjs'
import { writeServer } from './server.mjs'

export const write = async (app, config) => {
  const {
    DIR,
    CLIENT_LIB_NAME,
    // CLIENT_SERVICE_WORKER_NAME,
    // FILETYPES,
    IS_PROD,
    SPLIT_BUNDLES,
  } = config

  // const zippable = FILETYPES.ZIPPABLE
  // const images = FILETYPES.IMAGES

  const { css, client } = app
  await fs.mkdirp(DIR.PUBLIC)

  await writeStatic(app, config)

  await writePages(app, config)

  if (SPLIT_BUNDLES) {
    log.warn('W_NOT_IMPLENTED', 'should write client bundles for js and css.')
  } else {
    const jsFile = path.join(DIR.PUBLIC, `${CLIENT_LIB_NAME}.js`)
    await fs.writeFile(jsFile, client)

    const cssFile = path.join(DIR.PUBLIC, `${CLIENT_LIB_NAME}.css`)
    const usedCss = IS_PROD ? css.minified : css.css
    await fs.writeFile(cssFile, usedCss)
  }


  // const serviceWorkerFile = path.join(DIR.PUBLIC, `${CLIENT_SERVICE_WORKER_NAME}.js`)
  // await fs.writeFile(serviceWorkerFile, app.sw)

  await writeServer(app)
}

export default write
