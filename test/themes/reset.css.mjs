import { is, css } from '@magic/test'

import { reset } from '../../src/themes/reset.css.mjs'

export default [
  { fn: () => reset, expect: is.function, info: 'reset.css style is a function' },
  // { fn: css(reset(global.config.THEME_VARS)), expect: is.object, info: 'reset.css can be transpiled' },
  // {
  //   fn: css(reset(global.config.THEME_VARS)),
  //   expect: t => t.minified.includes('h3,h4,h5,h6,p,blockquote,pre,a,abbr'),
  //   info: 'reset contains expected css',
  // },
]
