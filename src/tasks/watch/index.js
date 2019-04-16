const fs = require('fs')
const path = require('path')

const { getDirectories } = require('../../lib')

const watch = async () => {
  const dir = config.ROOT

  const dirs = await getDirectories(dir)

  dirs.map(dir => {
    fs.watch(dir, (evt, file) => {
      const filePath = path.join(dir, file)
      process.send({ evt, file: filePath })
    })
  })
}

module.exports = watch
