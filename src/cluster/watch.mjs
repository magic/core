import path from 'path'

import is from '@magic/types'

import * as tasks from '../tasks/index.mjs'

const cwd = process.cwd()

export const watch = ({ args, ROOT, CONFIG_FILE_PATH, STATIC }) => {
  const watchDirs = args.watch
  let dirs = [ROOT]

  if (!is.array(STATIC)) {
    STATIC = [STATIC]
  }

  if (is.array(watchDirs)) {
    dirs = [...dirs, ...STATIC, ...watchDirs]
  } else if (is.string(watchDirs)) {
    dirs = [...dirs, ...STATIC, watchDirs]
  }

  dirs = dirs.map(dir => (dir.startsWith(cwd) ? dir : path.join(cwd, dir)))

  dirs.push(CONFIG_FILE_PATH)

  tasks.watch(dirs)
}
