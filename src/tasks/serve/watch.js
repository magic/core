const path = require('path')
const { requireNow } = require('../../lib/')
const log = require('@magic/log')

const prepare = require('../prepare')
const transpile = require('../transpile')

let watchTime = 300

const calculateWatchTime = end => {
  const hundredths = Math.ceil((end + 99) / 100)
  let newWatchTime = 0
  for (let i = 0; i < hundredths; i++) {
    newWatchTime += 100
  }
  if (newWatchTime < 300) {
    newWatchTime = 300
  }

  if (newWatchTime !== watchTime) {
    log.info(`setting watch time to ${watchTime}ms`)
    return newWatchTime
  }

  return watchTime
}

const watch = async () => {
  const start = new Date().getTime()

  const appPath = path.join(__dirname, '..', '..', 'modules', 'app.js')
  const newApp = requireNow(appPath)

  const prep = await prepare(newApp)

  const { pages, css, bundle } = transpile(prep)
  prep.pages = pages
  prep.css = css
  prep.lib.bundle = bundle

  global.app = prep

  const end = new Date().getTime() - start
  watchTime = calculateWatchTime(end)

  setTimeout(() => watch(app), watchTime)
}

module.exports = watch
