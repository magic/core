const fs = require('./fs')
const path = require('path')

const rmrf = async dir => {
  if (!dir) {
    throw new Error('rmrf: expecting a string argument.')
  }

  if (!dir.startsWith(process.cwd())) {
    throw new Error('rmrf will not work outside the cwd.')
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
}

module.exports = rmrf
