import path from 'path'
// import URL from 'url'

import { is } from '@magic/test'

import { fs, mkdirp, rmrf, getFiles, getDirectories } from '../../src/lib/index.mjs'

const url = new URL(import.meta.url)
const dirName = path.join(path.dirname(url.pathname), '.__test__')

const before = id => async () => {
  const dir = `${dirName}${id}`

  const files = [
    path.join(dir, 'test', 'deep', 'test.js'),
    path.join(dir, 'test2', 'deep', 'test2.js'),
    path.join(dir, 'test.js'),
  ]

  await mkdirp(path.join(dir, 'test', 'deep'))
  await mkdirp(path.join(dir, 'test2', 'deep'))

  await Promise.all(files.map(async f => await fs.writeFile(f, 't')))

  return async () => {
    await rmrf(dir)
  }
}

export default [
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
