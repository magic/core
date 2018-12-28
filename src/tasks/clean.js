const is = require('@magic/types')
const path = require('path')
const { rmrf } = require('../lib')
const config = require('../config')

const isLocalPath = p => {
  const cwd = process.cwd()
  return p.startsWith(cwd) && p !== cwd
}

const clean = ({ config }) => {
  const dir = config.DIR.TMP

  if (is.string(dir) && !is.empty(dir)) {
    if (!isLocalPath(path.resolve(dir))) {
      // do not delete above/outside the cwd
      const msg = `TRIED DELETING OUTSIDE OF CWD! ${dir} not in ${process.cwd()}`
      throw new Error(msg)
    }

    rmrf(dir)
  }
}

module.exports = clean
