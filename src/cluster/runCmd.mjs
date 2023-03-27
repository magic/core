import log from '@magic/log'

import * as tasks from '../tasks/index.mjs'

export const runCmd = async (cmd, ...args) => {
  const startTime = log.hrtime()

  try {
    const result = await tasks[cmd](...args)
    log.timeTaken(startTime, cmd)
    return result
  } catch (e) {
    log.timeTaken(startTime, cmd)
    return e
  }
}

export default runCmd
