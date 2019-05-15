import { is } from '@magic/test'

import css from '@magic/css'
import { reset } from '../../src/themes/reset.css.mjs'

const string = css(reset)
// console.log(string)

export default [
  { fn: reset, expect: is.object, info: 'reset.css style is an object' },
  { fn: css(reset), expect: is.object, info: 'reset.css can be transpiled' },
  {
    fn: css(reset),
    expect: t => t.minified.includes('h3,h4,h5,h6,p,blockquote,pre,a,abbr'),
    info: 'reset contains expected css',
  },
]
