const fs = require('./fs')
const path = require('path')
const deep = require('@magic/deep')

// recursively find all files in a directory.
// returns array of paths relative to dir

const getFilePath = dir => async file => {
  const filePath = path.join(dir, file)

  const stat = await fs.stat(filePath)
  if (stat.isDirectory(filePath)) {
    return await getFiles(filePath)
  } else if (stat.isFile()) {
    return filePath
  }
}

const getFiles = async dir => {
  const dirContent = await fs.readdir(dir)
  const files = await Promise.all(dirContent.map(getFilePath(dir)))

  const flattened = deep.flatten(files)
  return flattened
}

module.exports = getFiles
