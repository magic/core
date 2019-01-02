const transpilePage = require('./page')

module.exports = app => {
  console.log(app.pages)
  return app.pages.map(transpilePage(app))
}
