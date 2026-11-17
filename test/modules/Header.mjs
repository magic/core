import { has } from '@magic/test'

import { View } from '../../src/modules/Header.mjs'

export default [
  {
    fn: View({}),
    expect: undefined,
    info: 'Header returns undefined without logo, menu or logotext',
  },
  {
    fn: View({ logo: '/logo.png', logotext: 'MySite', root: '/' }),
    expect: has.string('Header', 'Logo'),
    info: 'Header renders Header and Logo',
  },
  {
    fn: View({ logotext: 'TextOnly', root: '/' }),
    expect: has.string('Header', 'Logo'),
    info: 'Header renders Logo from logotext alone',
  },
  {
    fn: View({ menu: [{ to: '/about', text: 'About' }], url: '/' }),
    expect: has.string('Header', 'About'),
    info: 'Header renders menu',
  },
  {
    fn: View({
      logo: '/logo.png',
      menu: [{ to: '/about', text: 'About' }],
      url: '/',
      hash: 'section',
    }),
    expect: has.string('Logo', 'About'),
    info: 'Header renders logo and menu together',
  },
]
