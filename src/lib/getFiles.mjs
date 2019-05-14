import fs from './fs.mjs'
import path from 'path'
import deep from '@magic/deep'

// recursively find all files in a directory.
// returns array of paths relative to dir

export const getFilePath = (dir, recurse = true) => async file => {
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

export const getFiles = async (dir, recurse = true) => {
  const dirContent = await fs.readdir(dir)
  const files = await Promise.all(dirContent.map(getFilePath(dir, recurse)))

  return deep.flatten(files).filter(a => a)
}

export default getFiles
