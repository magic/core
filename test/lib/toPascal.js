const { toPascal } = require('../../src/lib')

module.exports = [
  { fn: toPascal('testing-string'), expect: 'TestingString' },
  { fn: toPascal('lowercase'), expect: 'Lowercase' },
  { fn: toPascal('AlreadyPascal'), expect: 'AlreadyPascal' },
]