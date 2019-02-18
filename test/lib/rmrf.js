const path = require('path')
const { is, tryCatch } = require('@magic/test')

const fs = require('fs')
const { rmrf, mkdirp } = require('../../src/lib/')

const testDirRoot = path.join(__dirname, 'rmrf')
const testDir = path.join(testDirRoot, 'deep', 'deeper')

const before = async () => {
  await mkdirp(testDir)
  const touchFile = path.join(testDir, 'touched.js')
  fs.writeFileSync(touchFile, 'true')
}

module.exports = [
  { fn: tryCatch(fs.rmrf), expect: is.error, info: 'rmrf expects an argument' },
  {
    fn: async () => await rmrf(testDirRoot),
    before,
    expect: () => !fs.existsSync(testDirRoot),
    info: 'rmrf deeply deletes directory structures',
  },
  {
    fn: async () => await rmrf(path.join(__dirname, 'non', 'existent', 'dir')),
    expect: undefined,
    info: 'rmrf returns undefined if the directory/file does not exist',
  },
]
