const addTrailingSlash = str => (str.endsWith('/') ? str : `${str}/`)

module.exports = addTrailingSlash
