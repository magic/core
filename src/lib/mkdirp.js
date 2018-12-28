const path = require('path')
const fs = require('fs')

const mkdirp = p => {
  if (!p) {
    throw new Error('mkdirp needs an argument')
  }

  p = path.resolve(p)

  try {
    const dir = path.dirname(p)
    if (!fs.existsSync(dir)) {
      mkdirp(dir)
    }
    fs.mkdirSync(p)
    return true
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
}

module.exports = mkdirp
