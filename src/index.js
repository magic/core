const { transpile, write } = require('./tasks')
const { app } = require('./modules')

const renderApp = () => {
  const { pages, dependencies } = transpile(app)

  app.dependencies = dependencies
  write(pages, app)
}

renderApp()
