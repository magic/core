const path = require('path')
const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminGifsicle = require('imagemin-gifsicle')

const minifyImages = async images => {
  const imageGlob = `**/*.{${images.join(',')}}`
  const input = [path.join(config.DIR.STATIC, imageGlob)]
  const output = config.DIR.PUBLIC

  await imagemin(input, output, {
    plugins: [
      imageminMozjpeg({ quality: 70 }),
      imageminPngquant({ quality: [0.6, 0.75] }),
      imageminGifsicle({ optimizationLevel: 3 }),
      imageminSvgo({
        plugins: [{ removeViewBox: false }],
      }),
    ],
  })
}
module.exports = minifyImages
