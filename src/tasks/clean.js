const is = require('@magic/types')
const path = require('path')
const { rmrf, isLocalPath } = require('../lib')

const clean = () => {
  const dir = config.DIR.PUBLIC

  if (is.string(dir) && !is.empty(dir)) {
    if (!isLocalPath(path.resolve(dir))) {
      // do not delete above/outside the cwd
      const msg = `TRIED DELETING OUTSIDE OF CWD! ${dir} not in ${process.cwd()}`
      throw new Error(msg)
    }

    console.log('remove', dir)
    rmrf(dir)
  }
}

module.exports = clean
