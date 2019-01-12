const path = require('path')
const fs = require('fs')

const { mkdirp } = require('../../src/lib')

const dirName = path.join(__dirname, '.__test__')

const files = [
  path.join(dirName, 'test', 'deep', 'test.js'),
  path.join(dirName, 'test2', 'deep', 'test2.js'),
  path.join(dirName, 'test.js'),
]

const before = () => {
  mkdirp(path.join(dirName, 'test', 'deep'))
  mkdirp(path.join(dirName, 'test2', 'deep'))

  files.map(f => {
    // console.log(f)
    return fs.writeFileSync(f, 't')
  })

  return () => {
    fs.rmSync(dirName)
  }
}

module.exports = [
  { fn: true, expect: true },
  // {
  //   fn: getFiles(dirName),
  //   before,
  //   expect: is.length.equal(3),
  //   info: 'finds all files in directory. recursively.',
  // },
]
