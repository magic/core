import { is } from '@magic/test'

import { createFileHash } from '../../src/lib/index.mjs'

export default [
  { fn: createFileHash('testing-string'), expect: is.string },
  { fn: createFileHash('testing-string'), expect: t => t.startsWith('sha384-') },
  { fn: createFileHash('testing-string'), expect: createFileHash('testing-string') },
]
