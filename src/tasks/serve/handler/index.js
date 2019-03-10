const isProd = process.env.NODE_ENV === 'production'

const handler = require(isProd ? './prod' : './dev')

module.exports = handler