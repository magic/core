import path from 'path'

import is from '@magic/types'
import fs from '@magic/fs'

/**
 * @param {string} dir
 * @returns {(evt: unknown, file?: unknown) => void}
 */
const onFileChange =
  dir =>
  (evt, file = '') => {
    const fileStr = is.string(file) ? file : ''
    const filePath = path.join(dir, fileStr)
    const evtStr = is.string(evt) ? evt : 'change'

    process.send?.({ evt: evtStr, file: filePath })
  }

/**
 * @param {string} src
 * @returns {Promise<void>}
 */
const watchListener = async src => {
  const stat = await fs.stat(src)

  if (stat.isDirectory()) {
    fs.watch(src, onFileChange(src))

    const subDirs = await fs.getDirectories(src, { depth: 1 })
    const promises = subDirs.filter(dir => dir !== src).map(watchListener)

    await Promise.all(promises)
  } else if (stat.isFile()) {
    fs.watchFile(src, onFileChange(src))
  }
}

/**
 * @param {string[]} files
 * @returns {Promise<void[]>}
 */
export const watch = async files => await Promise.all(files.map(watchListener))

export default watch
