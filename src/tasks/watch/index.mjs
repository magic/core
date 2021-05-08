import path from 'path'

import is from '@magic/types'
import fs from '@magic/fs'

const onFileChange = dir => (evt, file = '') => {
  if (!is.string(file)) {
    file = ''
  }

  const filePath = path.join(dir, file)
  if (!is.str(evt)) {
    evt = 'change'
  }

  process.send({ evt, file: filePath })
}

const watchListener = async src => {
  const stat = await fs.stat(src)

  if (stat.isDirectory(src)) {
    fs.watch(src, onFileChange(src))

    const searchDepth = 1
    const subDirs = await fs.getDirectories(src, searchDepth)
    const promises = subDirs.filter(dir => dir !== src).map(watchListener)

    await Promise.all(promises)
  } else if (stat.isFile(src)) {
    fs.watchFile(src, onFileChange(src))
  }
}

export const watch = async files => await Promise.all(files.map(watchListener))

export default watch
