import { is } from '@magic/test'

import { uniqueMerge } from '../../src/lib/index.mjs'

const a = { a: ['a', 'b', 'c', 'e'], b: ['aa', 'bb', 'cc', 'dd'] }
const b = { a: ['b', 'c', 'd'], b: ['cc', 'dd', 'ee', 'ff'], c: ['aa', 'bb', 'dd'] }
const c = {
  a: ['a', 'b', 'c', 'd', 'e'],
  b: ['aa', 'bb', 'cc', 'dd', 'ee', 'ff'],
  c: ['aa', 'bb', 'dd'],
}

export default [
  { fn: uniqueMerge(a, b), expect: is.objectNative, info: 'uniqueMerge returns an array' },
  {
    fn: uniqueMerge(a, undefined),
    expect: is.deep.equal(a),
    info: 'uniqueMerge returns a if b is falsy',
  },
  {
    fn: uniqueMerge(undefined, b),
    expect: is.deep.equal(b),
    info: 'uniqueMerge returns b if a is falsy',
  },
  { fn: uniqueMerge(a, b), expect: is.deep.equal(c), info: 'uniqueMerge merges a and b into c' },
  { fn: uniqueMerge(b, a), expect: is.deep.equal(c), info: 'uniqueMerge merges b and a into c' },
]
