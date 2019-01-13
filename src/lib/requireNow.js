const util = require('util')
const fs = require('fs')
const babel = require('@babel/core')

const requireNow = file => {
  if (!fs.existsSync(file)) {
    throw new Error(`requireNow: file does not exist ${file}`)
  }

  try {
    // const cnt = babel.transformFileSync(file)
    return require(file)
  } catch (e) {
    console.log('eval error', e)
  }
}

module.exports = requireNow
