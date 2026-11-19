import { is, has } from '@magic/test'

import { View } from '../../src/modules/Menu.mjs'

export default [
  {
    fn: View({ menu: [{ to: '/about', text: 'About' }], url: '/' }),
    expect: is.string,
    info: 'Menu View renders to a string',
  },
  {
    fn: View({ menu: [{ to: '/about', text: 'About' }], url: '/' }),
    expect: has.string('Menu', 'About', '/about'),
    info: 'Menu View contains class and items',
  },
  {
    fn: View({ menu: [{ to: '/about', text: 'About' }], url: '/', hash: 'section' }),
    expect: has.string('/about'),
    info: 'Menu View renders items',
  },
  {
    fn: View({ menu: [], url: '/' }),
    expect: has.string('Menu'),
    info: 'Menu View renders with empty menu',
  },
  {
    fn: View({ menu: [{ to: '/about', text: 'About' }], url: '/', class: 'CustomMenu' }),
    expect: has.string('Menu', 'CustomMenu'),
    info: 'Menu View keeps custom class and adds Menu',
  },
]
