import { replaceSlashSlash } from '../../src/lib/index.mjs'

const testString1 = '//testing//test'

const expectWithSlash = '/testing/test'
const expectWithoutSlash = 'testingtest'
const expectWithSpace = ' testing test'

export default [
  {
    fn: replaceSlashSlash(testString1),
    expect: expectWithSlash,
    info: 'replaceSlashSlash by default replaces // with /',
  },
  {
    fn: replaceSlashSlash(testString1, ''),
    expect: expectWithoutSlash,
    info: 'replaceSlashSlash can replace // with ""',
  },
  {
    fn: replaceSlashSlash(testString1, ' '),
    expect: expectWithSpace,
    info: 'replaceSlashSlash can replace // with " "',
  },
]
