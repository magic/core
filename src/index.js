const config = require('./config')
const tasks = require('./tasks')

const App = require('./modules/app')

const runCmd = async (cmd, ...args) => {
  console.time(cmd)
  const result = await tasks[cmd](...args)
  console.timeEnd(cmd)
  return result
}

const run = async cmds => {
  console.time('render app')
  console.log(`render app ${Object.keys(cmds).join(' ')}`)

  global.config = require('./config')

  if (cmds.clean) {
    await runCmd('clean')
  }

  if (cmds.connect) {
    await runCmd('connect')
  }

  if (cmds.publish) {
    await runCmd('publish')
  }

  if (cmds.build || cmds.serve) {
    const app = await runCmd('prepare', App)

    const { pages, bundle, css } = await runCmd('transpile', app)
    app.pages = pages
    app.lib.bundle = bundle
    app.css = css

    if (cmds.build) {
      await runCmd('write', app)
    }

    console.timeEnd('render app')

    if (cmds.serve) {
      tasks.serve(app)
    }
  }
}

module.exports = run
