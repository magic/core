const { getFiles, getDependencies } = require('./lib/')
const { prepare, transpile } = require('./lib/tasks')
const config = require('./config')
const { app } = require('./lib')

const renderApp = () => {
  const files = getFiles(config.DIR.PAGE)
  const { pages, dependencies } = prepare(files, app)

  app.dependencies = dependencies
  transpile(pages, app)
}

renderApp()
