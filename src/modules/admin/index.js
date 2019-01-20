const lib = process.env.NODE_ENV === 'production' ? './magic' : './admin'
module.exports = require(lib)
