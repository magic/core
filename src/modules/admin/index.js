const lib = config.ENV === 'production' ? './magic' : './admin'
module.exports = require(lib)
