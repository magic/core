import { is } from '@magic/test'

import { getContentType, contentTypes } from '../../src/lib/index.mjs'

export default [
  ...Object.entries(contentTypes).map(([ext, type]) => {
    return {
      fn: getContentType(`file.${ext}`),
      expect: type,
    }
  }),
  {
    fn: getContentType('file.unknown'),
    expect: 'text/plain',
    info: 'unknown content returns text/plain',
  },
]
