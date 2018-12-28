const is = require('@magic/types')
const path = require('path')
const { rmrf } = require('../lib')
const config = require('../config')

const isLocalPath = p => {
  const cwd = process.cwd()
  return p.startsWith(cwd) && p !== cwd
}

const clean = () => {
  const dir = config.DIR.TMP
  console.time('clean')
  console.log(`start cleaning ${dir})`)

  if (is.string(dir) && !is.empty(dir)) {
    if (!isLocalPath(path.resolve(dir))) {
      // do not delete above/outside the cwd
      const msg = `TRIED DELETING OUTSIDE OF CWD! ${dir} not in ${process.cwd()}`
      throw new Error(msg)
    }

    rmrf(dir)
  }
  console.timeEnd('clean')
}

module.exports = clean
