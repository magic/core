const tasks = {
  write: require('./write'),
  prepare: require('./prepare/'),
  clean: require('./clean'),
  serve: require('./serve'),
  transpile: require('./transpile'),
  connect: require('./connect'),
  publish: require('./publish'),
  watch: require('./watch'),
}

const runCmd = async (cmd, ...args) => {
  console.time(cmd)
  const result = await tasks[cmd](...args)
  console.timeEnd(cmd)
  return result
}

const run = async (App, cmds) => {
  console.time('render app')
  console.log(`render app ${Object.keys(cmds).join(' ')}`)

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
      tasks.watch()
    }
  }

  if (!cmds.serve){
    process.exit()
  }
}

module.exports = run