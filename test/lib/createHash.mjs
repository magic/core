import { is } from '@magic/test'

import { createHash } from '../../src/lib/index.mjs'

export default [
  { fn: createHash('testing-string'), expect: is.string },
  { fn: createHash('testing-string'), expect: t => t.startsWith('sha384-') },
  { fn: createHash('testing-string'), expect: createHash('testing-string') },
]
