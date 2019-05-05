const isTagUsed = require('./isTagUsed')

const getUsedComponents = str => Array.from(global.keys).filter(isTagUsed(str))

module.exports = getUsedComponents
