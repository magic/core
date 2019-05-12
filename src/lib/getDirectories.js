const fs = require('./fs')
const path = require('path')

const is = require('@magic/types')
const deep = require('@magic/deep')

// recursively find all directories in a directory.
// returns array of paths relative to dir

const getFilePath = async (dir, file, recurse = true) => {
  const filePath = path.join(dir, file)

  const stat = await fs.stat(filePath)
  if (stat.isDirectory(filePath)) {
    if (recurse) {
      return await getDirectories(filePath, recurse)
    } else {
      return filePath
    }
  }
}

const getDirectories = async (directories, recurse = true) => {
  if (is.array(directories)) {
    const dirs = await Promise.all(
      directories.filter(fs.exists).map(f => getDirectories(f, recurse)),
    )
    return deep.flatten(...dirs).filter(a => a)
  }

  const exists = await fs.exists(directories)
  if (!exists) {
    return []
  }

  let flattened = [directories]
  const dirContent = await fs.readdir(directories)
  const dirs = await Promise.all(
    dirContent.map(async file => await getFilePath(directories, file, recurse)),
  )
  flattened = deep.flatten(flattened, dirs)

  return flattened.filter(a => a)
}

module.exports = getDirectories
