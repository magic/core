// const isProd = config.ENV === 'production'

const handler = require(/*isProd ? './prod' : */ './dev')

module.exports = handler
