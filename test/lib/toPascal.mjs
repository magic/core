import { toPascal } from '../../src/lib/index.mjs'

export default [
  { fn: toPascal('testing-string'), expect: 'TestingString' },
  { fn: toPascal('lowercase'), expect: 'Lowercase' },
  { fn: toPascal('AlreadyPascal'), expect: 'AlreadyPascal' },
]
