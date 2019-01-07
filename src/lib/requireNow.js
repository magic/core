const fs = require('fs')

const requireNow = file => {
  if (fs.existsSync(file)) {
    throw new Error(`requireNow: file does not exist ${file}`)
  }
  const content = fs.readFileSync(file, 'utf8')

  if (content.length === 0) {
    throw new Error(`requireNow: required file is empty ${file}`)
  }

  const e = eval(content)
  return e
}

module.exports = requireNow
