import { is, tryCatch } from '@magic/test'

import { CHECK_PROPS } from '../../src/lib/CHECK_PROPS.mjs'

export default [
  {
    fn: tryCatch(CHECK_PROPS, undefined, undefined, undefined, false),
    expect: is.err,
    info: 'CHECK_PROPS without arguments errors',
  },
  // { fn: tryCatch(CHECK_PROPS, { key: false }, { key: 'boolean' }), expect: t => t[0].message.includes('expected Module name as third argument'), info: 'CHECK_PROPS without arguments errors with third arg error.' },
  {
    fn: tryCatch(CHECK_PROPS, undefined, undefined, undefined, false),
    expect: false,
    info: 'CHECK_PROPS without second argument errors and returns false.',
  },
]
