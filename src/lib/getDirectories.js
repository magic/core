const fs = require('./fs')
const path = require('path')
const deep = require('@magic/deep')

// recursively find all directories in a directory.
// returns array of paths relative to dir

const getFilePath = async (dir, file) => {
  const filePath = path.join(dir, file)

  const stat = await fs.stat(filePath)
  if (stat.isDirectory(filePath)) {
    return await getDirectories(filePath)
  }
}

const getDirectories = async dir => {
  const dirContent = await fs.readdir(dir)
  const dirs = await Promise.all(dirContent.map(async file => await getFilePath(dir, file)))
  const flattened = deep.flatten(dir, dirs).filter(a => a)
  return flattened
}

module.exports = getDirectories
