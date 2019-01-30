const path = require('path')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminGifsicle = require('imagemin-gifsicle')

const { getDirectories, fs } = require('../../lib/')

const minifyImages = async images => {
  const imageGlob = `*.{${images.join(',')}}`
  const staticExists = await fs.exists(config.DIR.STATIC)
  if (!staticExists) {
    return
  }

  const dirs = getDirectories(config.DIR.STATIC)

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
}
module.exports = minifyImages
