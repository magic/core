import path from 'path'

import is from '@magic/types'

import * as tasks from '../tasks/index.mjs'

const cwd = process.cwd()

export const watch = ({ args, config }) => {
  const watchDirs = args.watch
  let dirs = [config.ROOT]

  if (is.array(watchDirs)) {
    dirs = [...dirs, ...watchDirs]
  }

  dirs = dirs.map(dir => (dir.startsWith(cwd) ? dir : path.join(cwd, dir)))

  tasks.watch(dirs)
}
