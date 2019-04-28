const fs = require('./fs')
const path = require('path')

const is = require('@magic/types')
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

const getDirectories = async directories => {
  if (is.array(directories)) {
    const dirs = await Promise.all(directories.filter(fs.exists).map(getDirectories))
    return deep.flatten(...dirs).filter(a => a)
  }

  const exists = await fs.exists(directories)
  if (!exists) {
    return ''
  }

  let flattened = [directories]
  const dirContent = await fs.readdir(directories)
  const dirs = await Promise.all(dirContent.map(async file => await getFilePath(directories, file)))
  flattened = deep.flatten(flattened, dirs)

  return flattened.filter(a => a)
}

module.exports = getDirectories
