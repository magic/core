const fs = require('fs')
const path = require('path')
const deep = require('@magic/deep')

const getFiles = dir => {
  const files = fs.readdirSync(dir).map(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory(filePath)) {
      return getFiles(filePath)
    } else if (stat.isFile()) {
      return filePath
    }
  })

  const flattened = deep.flatten(files)
  return flattened
}

module.exports = getFiles
