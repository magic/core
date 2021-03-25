import path from 'path'

import is from '@magic/types'

import * as tasks from '../tasks/index.mjs'

const cwd = process.cwd()

export const watch = ({ args, ROOT, CONFIG_FILE_PATH }) => {
  const watchDirs = args.watch
  let dirs = [ROOT]

  if (is.array(watchDirs)) {
    dirs = [...dirs, ...watchDirs]
  } else if (is.string(watchDirs)) {
    dirs = [...dirs, watchDirs]
  }

  dirs = dirs.map(dir => (dir.startsWith(cwd) ? dir : path.join(cwd, dir)))

  dirs.push(CONFIG_FILE_PATH)

  tasks.watch(dirs)
}
