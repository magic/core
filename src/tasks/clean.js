const { rmrf } = require('../lib')

const clean = config => {
  console.time('clean')
  console.log(`start cleaning ${config.DIR.TMP})`)

  console.timeEnd('clean')
}

module.exports = clean