import { is, has } from '@magic/test'

import { View } from '../../src/modules/Footer.mjs'

export default [
  {
    fn: View({}, []),
    expect: is.string,
    info: 'Footer View renders to a string',
  },
  {
    fn: View({}, []),
    expect: has.string('Footer', 'Container'),
    info: 'Footer View contains Footer and Container markup',
  },
  {
    fn: View({}, [span('content')]),
    expect: has.string('content'),
    info: 'Footer View renders children',
  },
]
