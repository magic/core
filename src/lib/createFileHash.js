const crypto = require('crypto')

const checksum = str => {
  const hash = crypto.createHash('sha384')
  hash.update(str)
  const value = hash.digest('base64')
  return `sha384-${value}`
}

module.exports = checksum
