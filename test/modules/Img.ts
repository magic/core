import { has } from '@magic/test'

import { View } from '../../src/modules/Img.mjs'

export default [
  {
    fn: View('/image.png'),
    expect: has.string('src'),
    info: 'Img View renders img from string src',
  },
  {
    fn: View({ src: '/image.png' }),
    expect: has.string('/image.png'),
    info: 'Img View renders img from props object',
  },
  {
    fn: View({ src: '/image.png', title: 'A title' }),
    expect: has.string('alt', 'A title'),
    info: 'Img View uses title as alt when no alt',
  },
  {
    fn: View({ src: '/image.png', alt: 'My alt' }),
    expect: has.string('My alt'),
    info: 'Img View keeps explicit alt',
  },
  {
    fn: View({}),
    expect: undefined,
    info: 'Img View returns undefined without src',
  },
]
