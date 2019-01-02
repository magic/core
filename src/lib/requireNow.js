const fs = require('fs')
const path = require('path')

const requireNow = str => {
  const file = fs.readFileSync(str, 'utf8')

  // depending on the file type
  const e = eval(file)
  return e
}

module.exports = requireNow
