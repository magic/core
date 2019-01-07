const path = require('path')

const { fs } = require('../../lib')

const writeFile = async ([name, content]) => {
  name = path.join(config.DIR.PUBLIC, name)
  return await fs.writeFile(name, content)
}

module.exports = writeFile