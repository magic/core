import { stringifyObject } from '../../src/lib/stringifyObject.mjs'

const fn = () => {}

export default [
  { fn: stringifyObject('string'), expect: `'string'`, info: 'stringifies string' },
  {
    fn: stringifyObject("it's"),
    expect: `"it's"`,
    info: 'uses double quotes for strings with apostrophe',
  },
  { fn: stringifyObject(42), expect: 42, info: 'passes numbers through' },
  { fn: stringifyObject(true), expect: true, info: 'passes booleans through' },
  { fn: stringifyObject(null), expect: null, info: 'passes null through' },
  { fn: stringifyObject(undefined), expect: undefined, info: 'passes undefined through' },
  { fn: stringifyObject([1, 2, 3]), expect: `[1,2,3]`, info: 'stringifies arrays' },
  { fn: stringifyObject(['a', 'b']), expect: `['a','b']`, info: 'stringifies string arrays' },
  { fn: stringifyObject(fn), expect: fn.toString(), info: 'stringifies functions' },
  { fn: stringifyObject(/regex/), expect: '/regex/', info: 'stringifies regex' },
  {
    fn: stringifyObject({ b: 2, a: 1 }),
    expect: `  {\n  'a': 1,\n  'b': 2\n  }\n`,
    info: 'stringifies and sorts object keys',
  },
  {
    fn: stringifyObject({ a: 1 }, false),
    expect: `{\n'a': 1\n}\n`,
    info: 'indent=false produces no indentation',
  },
]
