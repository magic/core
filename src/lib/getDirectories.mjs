import path from 'path'

import is from '@magic/types'
import deep from '@magic/deep'

import { fs } from './fs.mjs'

// recursively find all directories in a directory.
// returns array of paths relative to dir

export const getFilePath = async (dir, file, recurse = true) => {
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

export const fileExists = async f => {
  try {
    await fs.stat(f)
    return true
  } catch (e) {
    return false
  }
}

export const getDirectories = async (directories, recurse = true) => {
  if (is.array(directories)) {
    const dirPromises = directories
        .filter(fileExists)
        .map(async f => await getDirectories(f, recurse))
        .filter(a => a)

    const dirs = await Promise.all(dirPromises)
    return deep.flatten(...dirs)
  }

  try {
    let flattened = [directories]
    const dirContent = await fs.readdir(directories)
    const dirs = await Promise.all(
      dirContent.map(async file => await getFilePath(directories, file, recurse)),
    )
    flattened = deep.flatten(flattened, dirs)

    return flattened.filter(a => a)
  } catch(e) {
    if (e.code === 'ENOENT') {
      return []
    }

    throw e
  }
}
