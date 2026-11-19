import { is, tryCatch } from '@magic/test'

import { createHash } from '../../src/lib/createHash.mjs'

export default [
  { fn: createHash('testing-string'), expect: is.string, info: 'createHash returns a string' },
  {
    fn: createHash(Buffer.from('testing-string')),
    expect: createHash('testing-string'),
    info: 'createHash handles buffer input the same as string',
  },
  {
    fn: tryCatch(createHash, 123),
    expect: e => e instanceof Error && e.message.includes('expects a string or buffer'),
    info: 'createHash throws for non-string/non-buffer input',
  },
  {
    fn: tryCatch(createHash, ''),
    expect: e => e instanceof Error && e.message.includes('non empty'),
    info: 'createHash throws for empty string',
  },
  {
    fn: tryCatch(createHash, Buffer.alloc(0)),
    expect: is.error,
    info: 'createHash throws for empty buffer',
  },
]
