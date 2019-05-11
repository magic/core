const crypto = require('crypto')

const createFileHash = str => {
  const hash = crypto.createHash('sha384')
  hash.update(str)
  const value = hash.digest('base64')
  return `sha384-${value}`
}

module.exports = createFileHash
