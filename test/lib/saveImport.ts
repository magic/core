import { is } from '@magic/test'

import { saveImport } from '../../src/lib/saveImport.mjs'

export default [
  {
    fn: saveImport('/definitely/not/a/real/file.mjs'),
    expect: is.error,
    info: 'nonexistent module returns Error',
  },
  {
    fn: async () => {
      const result = await saveImport(new URL('../../src/lib/xc.mjs', import.meta.url))
      return is.fn((result as { xc?: unknown }).xc)
    },
    expect: true,
    info: 'existing module is imported',
  },
]
