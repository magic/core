const path = require('path')
const { is } = require('@magic/test')
const config = require('../src/config')

module.exports = [
  { fn: config, expect: is.object, info: 'config is an object' },
  { fn: config.ROOT, expect: is.string, info: 'config.ROOT is a string' },
  {
    fn: config.ROOT,
    expect: path.join(process.cwd(), 'example'),
    info: 'config.ROOT has the expected value',
  },
  {
    fn: config.DIR.PUBLIC,
    expect: path.join(process.cwd(), 'public'),
    info: 'config.DIR.PUBLIC has the expected value',
  },
  {
    fn: config.DIR.PAGES,
    expect: path.join(process.cwd(), 'example', 'pages'),
    info: 'config.DIR.PAGES has the expected value',
  },
]
