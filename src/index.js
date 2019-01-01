const config = require('./config')
const { clean, prepare, transpile, serve, write } = require('./tasks')

const runCmd = (cmd, fn, ...args) => {
  console.time(cmd)
  fn(...args)
  console.timeEnd(cmd)
}

const renderApp = cmds => {
  console.time('render app')
  console.log(`render app ${Object.keys(cmds).join(' ')}`)

  runCmd('prepare', prepare, { config })

  if (cmds.clean) {
    runCmd('clean', clean, { config })
  }

  runCmd('transpile', transpile)

  if (cmds.build || cmds.serve) {
    runCmd('write', write)
  }

  console.timeEnd('render app')

  if (cmds.serve) {
    serve()
  }
}

module.exports = renderApp
