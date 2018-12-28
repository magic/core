const { getFiles, app, getDependencies } = require('./lib/')
const { prepare, transpile } = require('./lib/tasks')

const config = require('./config')

const renderApp = () => {
  const files = getFiles(config.DIR.PAGE)

  const pages = prepare.pages(files)

  app.str = app.View.toString()
  app.dependencies = prepare.dependencies(app.str)

  const { dependencies, components, tags } = getDependencies(pages)

  const style = transpile.pages(pages)
  transpile.vendor(components, tags)
  transpile.style(style)
}

renderApp()
