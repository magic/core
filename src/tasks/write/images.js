const path = require('path')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminGifsicle = require('imagemin-gifsicle')

const getDirectories = require('../../lib/getDirectories')

const minifyImages = async images => {
  const imageGlob = `*.{${images.join(',')}}`
  const dirs = getDirectories(config.DIR.STATIC)

  await Promise.all(dirs.map(async dir => {
    const input = [path.join(dir, imageGlob)]
    const output = dir.replace(config.DIR.STATIC, config.DIR.PUBLIC)

    return await imagemin(input, output, {
      plugins: [
        imageminMozjpeg({ quality: 90 }),
        imageminPngquant({ quality: [0.85, 0.9] }),
        imageminGifsicle({ optimizationLevel: 3 }),
        imageminSvgo({
          plugins: [{ removeViewBox: false }],
        }),
      ],
    })
  }))
}
module.exports = minifyImages
