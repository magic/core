const log = require('@magic/log')

const tasks = require('../tasks')

const runCmd = async (cmd, ...args) => {
  log.time(cmd)
  const result = await tasks[cmd](...args)
  log.timeEnd(cmd)
  return result
}

module.exports = runCmd
