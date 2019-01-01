const config = require('./config')
const tasks = require('./tasks')

const runCmd = (cmd, ...args) => {
  console.time(cmd)
  const result = tasks[cmd](...args)
  console.timeEnd(cmd)
  return result
}

const renderApp = cmds => {
  console.time('render app')
  console.log(`render app ${Object.keys(cmds).join(' ')}`)

  const app = runCmd('prepare', { config })

  if (cmds.clean) {
    runCmd('clean')
  }

  const { pages, code, css } = runCmd('transpile', app)
  app.pages = pages
  app.lib.code = code
  app.css = css

  if (cmds.build || cmds.serve) {
    runCmd('write', app)
  }

  console.timeEnd('render app')

  if (cmds.connect) {
    runCmd('connect')
  }

  if (cmds.publish) {
    runCmd('publish')
  }

  if (cmds.serve) {
    tasks.serve(app)
  }
}

module.exports = renderApp
