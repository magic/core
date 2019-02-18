const path = require('path')
const fs = require('fs')

const { is } = require('@magic/test')

const { mkdirp, rmrf, getFiles, getDirectories } = require('../../src/lib')
const dirName = path.join(__dirname, '.__test__')

const before = (id) => async () => {
  const dir = `${dirName}${id}`

  const files = [
    path.join(dir, 'test', 'deep', 'test.js'),
    path.join(dir, 'test2', 'deep', 'test2.js'),
    path.join(dir, 'test.js'),
  ]
  await mkdirp(path.join(dir, 'test', 'deep'))
  await mkdirp(path.join(dir, 'test2', 'deep'))

  files.map(f => {
    // console.log(f)
    return fs.writeFileSync(f, 't')
  })

  return async () => {
    await rmrf(dir)
  }
}

module.exports = [
  {
    fn: async () => await getFiles(`${dirName}1`),
    before: before(1),
    expect: is.length.equal(3),
    info: 'finds all files in directory. recursively.',
  },
  {
    fn: async () => await getDirectories(`${dirName}2`),
    before: before(2),
    expect: is.length.equal(5),
    info: 'finds all directories in directory. recursively',
  },
]