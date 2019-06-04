import path from 'path'
import imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminGifsicle from 'imagemin-gifsicle'

import { getDirectories } from './getDirectories.mjs'

export const minifyImages = async images => {
  const imageGlob = `*.{${images.join(',')}}`
  try {
    const dirs = await getDirectories(config.DIR.STATIC)

    await Promise.all(
      dirs.map(async dir => {
        const input = [path.join(dir, imageGlob)]
        const output = dir.replace(config.DIR.STATIC, config.DIR.PUBLIC)

        return await imagemin(input, output, {
          plugins: [
            imageminMozjpeg(config.IMAGEMIN.JPG),
            imageminPngquant(config.IMAGEMIN.PNG),
            imageminGifsicle(config.IMAGEMIN.GIF),
            imageminSvgo(config.IMAGEMIN.SVGO),
          ],
        })
      }),
    )
  } catch (e) {
    // do not throw if error is ENOENT
    if (e.code !== 'ENOENT') {
      throw e
    }
  }
}
