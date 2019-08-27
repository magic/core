import log from '@magic/log'

import * as tasks from '../tasks/index.mjs'

export const runCmd = async (cmd, ...args) => {
  const startTime = new Date().getTime()
  const result = await tasks[cmd](...args)
  const endTime = new Date().getTime()
  const timeTaken = Math.ceil(endTime - startTime)
  console.log(`${cmd}: ${timeTaken}ms`)
  return result
}

export default runCmd
