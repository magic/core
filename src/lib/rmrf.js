const fs = require('fs')
const path = require('path')

const rmrf = dir => {
  try {
    if (!dir) {
      throw new Error('rmrf: expecting a string argument.')
    }

    const exists = fs.existsSync(dir)
    if (!exists) {
      return
    }

    const stat = fs.statSync(dir)
    if (stat.isFile()) {
      fs.unlinkSync(dir)
    } else if (stat.isDirectory()) {
      const files = fs.readdirSync(dir)
      files.map(async file => rmrf(path.join(dir, file)))

      fs.rmdirSync(dir)
    }
  } catch (e) {
    throw e
  }
}

module.exports = rmrf
