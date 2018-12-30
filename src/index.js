const config = require('./config')
const globals = require('./tasks/globals')
globals({ config })
// require app after calling globals to get them in app
const { app } = require('./modules')

const { prepare, write, watch, clean, transpile, serve } = require('./tasks')

const renderApp = cmds => {
  console.time('render app')
  console.log(`render app ${cmds}`)

  if (cmds.includes('clean')) {
    console.time('clean')
    clean({ config })
    console.timeEnd('clean')
  }

  console.time('prepare')
  const prepared = prepare({ app, config })
  console.timeEnd('prepare')

  console.time('transpile')
  const transpiled = transpile({ config, ...prepared })
  console.timeEnd('transpile')

  if (cmds.includes('build') || cmds.includes('serve')) {
    console.time('build')
    write({ config, ...transpiled })
    console.timeEnd('build')
  }

  console.timeEnd('render app')

  const props = { config, transpiled, prepared }

  if (cmds.includes('watch')) {
    watch(props)
  }

  if (cmds.includes('serve')) {
    serve(props)
  }
}

module.exports = renderApp
