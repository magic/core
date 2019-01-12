const fs = require('fs')
const path = require('path')

const deep = require('@magic/deep')

const watched = {}

const getDirs = (dir) =>
  fs.readdirSync(dir).map(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      return [
        filePath,
        getDirs(filePath),
      ]
    } else {
      watched[filePath] = stat.mtimeMs
    }
  }).filter(a => a)


const watch = async () => {
  const dir = config.ROOT

  const dirs = deep.flatten(getDirs(dir))

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
