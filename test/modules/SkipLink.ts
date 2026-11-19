import { is, has } from '@magic/test'

import { View } from '../../src/modules/SkipLink.mjs'

export default [
  {
    fn: View(),
    expect: is.string,
    info: 'SkipLink View renders to a string',
  },
  {
    fn: View(),
    expect: has.string('SkipLink', 'Skip to Content', '/#page'),
    info: 'SkipLink View contains class, text and target hash',
  },
]
