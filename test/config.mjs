import path from 'path'
import { is } from '@magic/test'
import { runConfig } from '../src/config.mjs'

let config

const before = async () => {
  config = await runConfig()
}

export default [
  { before, fn: () => config, expect: is.object, info: 'config is an object' },
  { before, fn: () => config.THEME, expect: is.string, info: 'config.THEME is a string' },
  { before, fn: () => config.ENV, expect: is.string, info: 'config.ENV is a string' },
  { before, fn: () => config.WEB_ROOT, expect: is.string, info: 'config.WEB_ROOT is a string' },
  { before, fn: () => config.WEB_ROOT, expect: '/core/', info: 'config.WEB_ROOT equals /core/' },
  {
    before,
    fn: () => config.URL,
    expect: 'magic.github.io/core',
    info: 'config.URL equals magic.github.io/core',
  },
  // { fn: config.ROOT, expect: is.string, info: 'config.ROOT is a string' },
  // {
  //   fn: config.ROOT,
  //   expect: path.join(process.cwd(), 'example'),
  //   info: 'config.ROOT has the expected value',
  // },
  // {
  //   fn: config.DIR.PUBLIC,
  //   expect: path.join(process.cwd(), config.PUBLIC),
  //   info: 'config.DIR.PUBLIC has the expected value',
  // },
  // {
  //   fn: config.DIR && config.DIR.PAGES,
  //   expect: path.join(process.cwd(), 'example', 'pages'),
  //   info: 'config.DIR.PAGES has the expected value',
  // },
]
