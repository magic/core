const path = require('path')
const fs = require('fs')
const http = require('http')
const { addTrailingSlash, getContentType, requireNow } = require('../../lib/')
const is = require('@magic/types')
const log = require('@magic/log')

const isProd = process.env.NODE_ENV === 'production'

const prepare = require('../prepare')
const transpile = require('../transpile')

let watchTime = 100

const watch = () => {
  const start = new Date().getTime()

  const newApp = requireNow(path.join(process.cwd(), 'src', 'modules', 'app.js'))
  const prep = prepare(newApp)

  const { pages, css, code } = transpile(prep)
  prep.pages = pages
  prep.css = css
  prep.lib.code = code

  global.app = prep

  const end = new Date().getTime() - start
  const hundredths = Math.ceil((end + 99) / 100)
  let newWatchTime = 0
  for (let i = 0; i < hundredths; i++) {
    newWatchTime += 100
  }
  if (newWatchTime < 300) {
    newWatchTime = 300
  }

  if (newWatchTime !== watchTime) {
    watchTime = newWatchTime
    console.log(`setting watch time to ${watchTime}ms`)
  }

  setTimeout(() => watch(app), watchTime)
}

module.exports = watch
