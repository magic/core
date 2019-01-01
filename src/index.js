const config = require('./config')
const { clean, prepare, transpile, serve, write } = require('./tasks')

const renderApp = cmds => {
  console.time('render app')
  console.log(`render app ${cmds}`)

  console.time('prepare')
  prepare({ config })
  console.timeEnd('prepare')

  if (cmds.includes('clean')) {
    console.time('clean')
    clean({ config })
    console.timeEnd('clean')
  }

  console.time('transpile')
  transpile()
  console.timeEnd('transpile')
  // console.log(app)

  if (cmds.includes('build') || cmds.includes('serve')) {
    console.time('write')
    write()
    console.timeEnd('write')
  }

  console.timeEnd('render app')

  // const props = { config, transpiled, prepared }

  if (cmds.includes('watch')) {
    // watch(props)
  }

  if (cmds.includes('serve')) {
    serve()
  }
}

module.exports = renderApp
