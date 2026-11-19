import { isPageUrl } from '../../src/lib/isPageUrl.mjs'

export default [
  { fn: isPageUrl([], '/page'), expect: false, info: 'empty list returns false' },
  {
    fn: isPageUrl([{ name: '/page' }], '/page'),
    expect: true,
    info: 'matching name returns true',
  },
  {
    fn: isPageUrl([{ name: '/other' }], '/page'),
    expect: false,
    info: 'non-matching name returns false',
  },
  {
    fn: isPageUrl([{ name: '/page' }, { name: '/other' }], '/other'),
    expect: true,
    info: 'finds matching page in list',
  },
]
