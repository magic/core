const { toCamel } = require('../../src/lib')

module.exports = [
  { fn: toCamel('testing-string'), expect: 'testingString' },
  { fn: toCamel('lowercase'), expect: 'lowercase' },
  { fn: toCamel('alreadyCamel'), expect: 'alreadyCamel' },
]
