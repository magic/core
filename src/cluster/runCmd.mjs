import log from '@magic/log'

import * as tasks from '../tasks/index.mjs'

export const runCmd = async (cmd, ...args) => {
  log.time(cmd)
  const result = await tasks[cmd](...args)
  log.timeEnd(cmd)
  return result
}

export default runCmd
