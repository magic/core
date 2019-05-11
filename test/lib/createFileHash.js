const { is } = require('@magic/test')

const { createFileHash } = require('../../src/lib')

module.exports = [
  { fn: createFileHash('testing-string'), expect: is.string },
  { fn: createFileHash('testing-string'), expect: t => t.startsWith('sha384-') },
  { fn: createFileHash('testing-string'), expect: createFileHash('testing-string') },
]
