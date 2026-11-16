import log from '@magic/log'

import * as tasks from '../tasks/index.mjs'

/**
 * @param {keyof typeof tasks} cmd
 * @param {...unknown} args
 * @returns {Promise<unknown>}
 */
export const runCmd = async (cmd, ...args) => {
  const startTime = log.hrtime()

  try {
    const task = /** @type {(...a: unknown[]) => Promise<unknown>} */ (tasks[cmd])
    const result = await task(...args)
    log.timeTaken(startTime, cmd)
    return result
  } catch (e) {
    log.timeTaken(startTime, cmd)
    return e
  }
}

export default runCmd
