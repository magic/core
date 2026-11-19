import { replacePathSepForImport } from '../../src/lib/index.mjs'

export default [
  {
    fn: replacePathSepForImport('testing'),
    expect: 'testing',
    info: 'normal string is not changed',
  },
  {
    fn: replacePathSepForImport('\\testing\\', '\\'),
    expect: '/testing/',
    info: '\\ gets replaced to / on windows',
  },
  {
    fn: replacePathSepForImport('#testing#', '#'),
    expect: '/testing/',
    info: 'if # would be a separator, it would get replaced.',
  },
]
