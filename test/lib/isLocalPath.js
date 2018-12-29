const path = require('path')
const { is, tryCatch } = require('@magic/test')

const { isLocalPath } = require('../../src/lib/')

const notLocalPath = path.join(process.cwd(), '..', '..', 'maybe', 'root')
const localPath = path.join(process.cwd(), 'is', 'local', 'path')

module.exports = [
  { fn: () => isLocalPath, expect: is.fn, info: 'isLocalPath is a function' },
  { fn: isLocalPath(notLocalPath), expect: false, info: 'false for non local path' },
  { fn: isLocalPath(localPath), expect: true, info: 'true for local path' },
  { fn: isLocalPath(process.cwd()), expect: false, info: 'false for cwd itself' },
]
