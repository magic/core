import is from '@magic/types'
import path from 'path'

import * as tasks from '../tasks/index.mjs'

export const watch = (argv, config) => {
  const watchDirs = argv['--watch']
  let dirs = [config.ROOT]
  if (is.array(watchDirs) && !is.empty(watchDirs)) {
    dirs = [...dirs, ...watchDirs]
  }
  const cwd = process.cwd()
  dirs = dirs.map(dir => (dir.startsWith(cwd) ? dir : path.join(cwd, dir)))
  tasks.watch(dirs)
}
