const runCmd = require('./runCmd')

const bailEarly = async cmds => {
  if (cmds.clean) {
    await runCmd('clean')
  }

  if (cmds.connect) {
    await runCmd('connect')
  }

  if (cmds.publish) {
    await runCmd('publish')
  }

  const bail = !cmds.build && !cmds.serve
  return bail
}

