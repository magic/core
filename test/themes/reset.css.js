const { is } = require('@magic/test')

const css = require('@magic/css')
const reset = require('../../src/themes/reset.css.js')

const string = css(reset)
// console.log(string)

module.exports = [
  { fn: reset, expect: is.object, info: 'reset.css style is an object' },
  { fn: css(reset), expect: is.object, info: 'reset.css can be transpiled' },
  {
    fn: css(reset),
    expect: t => t.minified.includes('h3,h4,h5,h6,p,blockquote,pre,a,abbr'),
    info: 'reset contains expected css',
  },
]
