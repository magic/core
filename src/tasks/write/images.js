const path = require('path')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')

const minifyImages = async () => {
  const imageGlob = path.join(config.DIR.PUBLIC, '*.{jpg,png,svg,gif}')
  return await imagemin([imageGlob], config.DIR.PUBLIC, {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({ quality: '65-80' }),
      imageminSvgo({
        plugins: [{ removeViewBox: false }],
      }),
    ],
  })
}

module.exports = minifyImages
