import path from 'path'

import log from '@magic/log'
import browserify from 'browserify'

import { runBabel, fs } from '../../lib/index.mjs'

export default async ({ str }) => {
  const hyperappPath = path.join(process.cwd(), 'node_modules', 'hyperapp', 'src', 'index.mjs')
  const hyperappContent = await fs.readFile(hyperappPath, 'utf8')

  const hyperapp = `
const { h, app } = (() => {
  ${hyperappContent.replace(/export /g, '')}

  return {
    h,
    app,
  }
})()
`

  const filePath = path.join(config.DIR.PUBLIC, 'magic.mjs')
  str = `// hyperapp\n${hyperapp}\n// magic\n${str}`
  // console.log({ str })
  return str
}
