const isTagUsed = require('./isTagUsed')

const getUsedComponents = (str, keys) => Array.from(keys).filter(isTagUsed(str))

module.exports = getUsedComponents
