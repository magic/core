import { isHashedUrl } from '../../src/lib/index.mjs'

export default [
  {
    fn: isHashedUrl([], 'testing'),
    expect: false,
    info: 'normal string is not a hashed url',
  },
  {
    fn: isHashedUrl([{ name: 'page', rendered: 'id="testing"' }], 'page#testing'),
    expect: true,
    info: 'valid list and url args work.',
  },
  {
    fn: isHashedUrl([{ name: 'page', rendered: 'id="testing"' }], 'page2#testing'),
    expect: false,
    info: 'valid list and non existant page return false.',
  },
]
