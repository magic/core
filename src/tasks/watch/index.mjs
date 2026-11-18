import path from 'path'

import fs from '@magic/fs'
import is from '@magic/types'

/** @type {(() => void)[]} */
const watchCleanups = []

/**
 * Register a cleanup function for a watcher.
 * @param {() => void} cleanup
 */
export const registerWatchCleanup = cleanup => {
  watchCleanups.push(cleanup)
}

/**
 * Close all registered watchers and clear the registry.
 */
export const cleanupWatch = () => {
  watchCleanups.forEach(close => close())
  watchCleanups.length = 0
}

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
    const watcher = fs.watch(src, onFileChange(src))
    registerWatchCleanup(() => watcher.close())

    const subDirs = await fs.getDirectories(src, { depth: 1 })
    const promises = subDirs.filter(dir => dir !== src).map(watchListener)

    await Promise.all(promises)
  } else if (stat.isFile()) {
    // fs.watchFile returns a StatWatcher without a close() method,
    // the watcher is stopped by calling fs.unwatchFile with the path
    fs.watchFile(src, onFileChange(src))
    registerWatchCleanup(() => fs.unwatchFile(src))
  }
}

/**
 * @param {string[]} files
 * @returns {Promise<void[]>}
 */
export const watch = async files => await Promise.all(files.map(watchListener))

export default watch
