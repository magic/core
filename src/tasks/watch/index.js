const { fs } = require('../../lib')
const path = require('path')

const { getDirectories } = require('../../lib')

const watch = async dir => {
  const dirs = await getDirectories(dir)

  dirs.map(dir => {
    fs.watch(dir, (evt, file) => {
      const filePath = path.join(dir, file)
      process.send({ evt, file: filePath })
    })
  })
}

module.exports = watch
