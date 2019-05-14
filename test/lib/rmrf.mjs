import path from 'path'
import { is, tryCatch } from '@magic/test'

import fs from 'fs'
import { rmrf, mkdirp } from '../../src/lib/index.mjs'

const url = new URL(import.meta.url)
const dirName = path.join(path.dirname(url.pathname), '.__test__')

const testDirRoot = path.join(dirName, 'rmrf')
const testDir = path.join(testDirRoot, 'deep', 'deeper')

const before = async () => {
  await mkdirp(testDir)
  const touchFile = path.join(testDir, 'touched.js')
  fs.writeFileSync(touchFile, 'true')
}

export default [
  { fn: tryCatch(fs.rmrf), expect: is.error, info: 'rmrf expects an argument' },
  {
    fn: async () => await rmrf(testDirRoot),
    before,
    expect: () => !fs.existsSync(testDirRoot),
    info: 'rmrf deeply deletes directory structures',
  },
  {
    fn: async () => await rmrf(path.join(dirName, 'non', 'existent', 'dir')),
    expect: undefined,
    info: 'rmrf returns undefined if the directory/file does not exist',
  },
]
