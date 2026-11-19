import { is, has } from '@magic/test'

import { View } from '../../src/modules/Logo.mjs'

export default [
  {
    fn: View({ logo: '/logo.png', logotext: 'MyLogo', root: '/' }),
    expect: is.string,
    info: 'Logo View renders to a string',
  },
  {
    fn: View({ logo: '/logo.png', logotext: 'MyLogo', root: '/' }),
    expect: has.string('Logo', 'MyLogo', '/logo.png'),
    info: 'Logo View contains class, logotext and logo src',
  },
  {
    fn: View({ logotext: 'TextOnly', root: '/' }),
    expect: has.string('TextOnly'),
    info: 'Logo View renders text only when no logo',
  },
]
