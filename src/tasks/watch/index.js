const fs = require('fs')
const path = require('path')

const { getDirectories } = require('../../lib')

const watched = {}

const watch = async () => {
  const dir = config.ROOT

  const dirs = await getDirectories(dir)

  dirs.map(dir => {
    fs.watch(dir, (evt, file) => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      if (stat.mtimeMs !== watched[filePath]) {
        watched[filePath] = stat.mtimeMs

        process.send({ evt, file: filePath })
      }
    })
  })
}

module.exports = watch
