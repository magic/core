const config = require('./config')
const tasks = require('./tasks')

const runCmd = (cmd, ...args) => {
  console.time(cmd)
  tasks[cmd](...args)
  console.timeEnd(cmd)
}

const renderApp = cmds => {
  console.time('render app')
  console.log(`render app ${Object.keys(cmds).join(' ')}`)

  runCmd('prepare', { config })

  if (cmds.clean) {
    runCmd('clean', { config })
  }

  runCmd('transpile')

  if (cmds.build || cmds.serve) {
    runCmd('write')
  }

  console.timeEnd('render app')

  if (cmds.connect) {
    runCmd('connect')
  }

  if (cmds.serve) {
    tasks.serve()
  }
}

module.exports = renderApp
