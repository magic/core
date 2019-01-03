const transpilePage = require('./page')

module.exports = app => app.pages.map(transpilePage(app))
