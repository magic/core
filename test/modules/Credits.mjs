import { is, has } from '@magic/test'

import { View } from '../../src/modules/Credits.mjs'

export default [
  {
    fn: View(),
    expect: is.string,
    info: 'Credits View renders to a string',
  },
  {
    fn: View(),
    expect: has.string('Credits', 'magic'),
    info: 'Credits View contains Credits class and magic link',
  },
  {
    fn: View(),
    expect: has.string('https://magic.github.io/'),
    info: 'Credits View links to magic.github.io',
  },
]
