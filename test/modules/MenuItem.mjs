import { is, has } from '@magic/test'

import { View } from '../../src/modules/MenuItem.mjs'

export default [
  {
    fn: View({ url: '/', to: '/about', text: 'About' }),
    expect: is.string,
    info: 'MenuItem View renders to a string',
  },
  {
    fn: View({ url: '/', to: '/about', text: 'About' }),
    expect: has.string('About', '/about'),
    info: 'MenuItem View contains text and link',
  },
  {
    fn: View({ url: '/about', to: '/about', text: 'About' }),
    expect: has.string('active'),
    info: 'MenuItem View is active when to matches url',
  },
  {
    fn: View({ url: '/', text: 'Plain' }),
    expect: has.string('Plain'),
    info: 'MenuItem View renders span when no to',
  },
  {
    fn: View({ url: '/', to: '/parent', text: 'Parent', items: [{ to: '/child', text: 'Child' }] }),
    expect: has.string('Parent', 'Child', '/child'),
    info: 'MenuItem View renders child items when not collapsed',
  },
]
