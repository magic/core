const fs = require('./fs')
const path = require('path')
const deep = require('@magic/deep')

// recursively find all directories in a directory.
// returns array of paths relative to dir

const getFilePath = dir => async file => {
  const filePath = path.join(dir, file)

  const stat = await fs.stat(filePath)
  if (stat.isDirectory(filePath)) {
    return await getDirectories(filePath)
  }
}

const getDirectories = async dir => {
  const dirContent = await fs.readdir(dir)
  const dirs = await Promise.all(dirContent.map(getFilePath(dir)))

  const flattened = deep.flatten(dirs).filter(a => a)
  return flattened
}

module.exports = getDirectories
