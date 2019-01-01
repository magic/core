const util = require('util')

const { exec } = require('child_process')
const xc = util.promisify(exec)

module.exports = xc
