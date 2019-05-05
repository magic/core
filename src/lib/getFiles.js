const fs = require('./fs')
const path = require('path')
const deep = require('@magic/deep')

// recursively find all files in a directory.
// returns array of paths relative to dir

const getFilePath = dir => async (file, recurse = true) => {
  const filePath = path.join(dir, file)

  const stat = await fs.stat(filePath)
  if (stat.isDirectory(filePath)) {
    if (recurse) {
      return await getFiles(filePath, recurse)
    }
  } else if (stat.isFile()) {
    return filePath
  }
}

const getFiles = async (dir, recurse = true) => {
  const dirContent = await fs.readdir(dir)
  const files = await Promise.all(dirContent.map(getFilePath(dir)))

  return deep.flatten(files).filter(a => a)
}

module.exports = getFiles
