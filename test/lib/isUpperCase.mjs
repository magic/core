import { is } from '@magic/test'

import { isUpperCase } from '../../src/lib/index.mjs'

export default [
  { fn: isUpperCase('Test'), expect: true, info: 'Uppercase strings return true' },
  { fn: isUpperCase('TEST'), expect: true, info: 'FULL Uppercase strings return true' },
  { fn: isUpperCase('test'), expect: false, info: 'lowercase strings return false' },
  {
    fn: isUpperCase('tEST'),
    expect: false,
    info: 'lowercase strings return false even if only first char is lower',
  },
]
