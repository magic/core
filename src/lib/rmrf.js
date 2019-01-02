const fs = require('./fs')
const path = require('path')

const rmrf = async dir => {
  try {
    if (!dir) {
      throw new Error('rmrf: expecting a string argument.')
    }

    const exists = await fs.exists(dir)
    if (!exists) {
      return
    }

    const stat = await fs.stat(dir)
    if (stat.isFile()) {
      await fs.unlink(dir)
    } else if (stat.isDirectory()) {
      const files = await fs.readdir(dir)
      await Promise.all(files.map(async file => await rmrf(path.join(dir, file))))

      await fs.rmdir(dir)
    }
  } catch (e) {
    throw e
  }
}

module.exports = rmrf
