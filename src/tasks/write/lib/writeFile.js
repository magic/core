const path = require('path')

const { fs } = require('../../../lib')

const writeFile = async ([name, content]) =>
  await fs.writeFile(path.join(config.DIR.PUBLIC, name), content)

module.exports = writeFile
