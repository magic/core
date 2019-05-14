import { toCamel } from '../../src/lib/index.mjs'

export default [
  { fn: toCamel('testing-string'), expect: 'testingString' },
  { fn: toCamel('lowercase'), expect: 'lowercase' },
  { fn: toCamel('alreadyCamel'), expect: 'alreadyCamel' },
]
