import { is, tryCatch } from '@magic/test'

import { CHECK_PROPS } from '../../src/lib/CHECK_PROPS.mjs'

const tests = [
  {
    props: { str: 'teststring' },
    types: {
      TestRequiredMissing: [
        { key: 'str', type: 'string' },
        { key: 'str2', type: 'string', required: true },
      ],
    },
    name: 'TestRequiredMissing',
    expect: false,
    info: 'can test required value if missing',
  },
  {
    props: { str: 'teststring', str2: 'str2 exists' },
    types: {
      TestRequiredExists: [
        { key: 'str', type: 'string' },
        { key: 'str2', type: 'string', required: true },
      ],
    },
    name: 'TestRequiredExists',
    expect: true,
    info: 'can test required value if exists',
  },
  {
    props: { obj: {} },
    types: { TestRequiredEmptyObj: [{ key: 'obj', type: 'object', required: true }] },
    name: 'TestRequiredEmptyObj',
    expect: false,
    info: 'required empty object returns false',
  },
  {
    props: { obj: {} },
    types: { TestRequiredNonEmptyObj: [{ key: 'obj', type: 'object', required: true }] },
    name: 'TestRequiredNonEmptyObj',
    expect: false,
    info: 'required empty object returns false',
  },
  {
    props: { arr: [] },
    types: { TestRequiredEmptyArray: [{ key: 'arr', type: 'array', required: true }] },
    name: 'TestRequiredEmptyArray',
    expect: false,
    info: 'required empty array returns false',
  },
  {
    props: { arr: [1, 2, 3] },
    types: { TestRequiredNonEmptyArray: [{ key: 'arr', type: 'array', required: true }] },
    name: 'TestRequiredNonEmptyArray',
    expect: true,
    info: 'required non-empty array returns true.',
  },

  {
    props: { str: 'teststring' },
    types: { TestStringTrue: [{ key: 'str', type: 'string' }] },
    name: 'TestStringTrue',
    expect: true,
    info: 'can test string type if true',
  },
  {
    props: { str: 122 },
    types: { TestStringFalse: [{ key: 'str', type: 'string' }] },
    name: 'TestStringFalse',
    expect: false,
    info: 'can test string type if false',
  },
  {
    props: { num: 123 },
    types: { TestNumTrue: [{ key: 'num', type: 'number' }] },
    name: 'TestNumTrue',
    expect: true,
    info: 'can test number type if true',
  },
  {
    props: { num: 'not a number.' },
    types: { TestNumFalse: [{ key: 'num', type: 'number' }] },
    name: 'TestNumFalse',
    expect: false,
    info: 'can test number type if false',
  },
  {
    props: { num: 123 },
    types: { TestIntTrue: [{ key: 'num', type: 'integer' }] },
    name: 'TestIntTrue',
    expect: true,
    info: 'can test int type if true',
  },
  {
    props: { num: 'not an int' },
    types: { TestIntFalse: [{ key: 'num', type: 'integer' }] },
    name: 'TestIntFalse',
    expect: false,
    info: 'can test int type if false',
  },
  {
    props: { num: 123 },
    types: { TestIntMax: [{ key: 'num', type: 'integer', max: 122 }] },
    name: 'TestIntMax',
    expect: false,
    info: 'can test if int is bigger than max',
  },
  {
    props: { num: 123 },
    types: { TestIntMin: [{ key: 'num', type: 'integer', min: 124 }] },
    name: 'TestIntMin',
    expect: false,
    info: 'can test if int is smaller than min',
  },

  {
    props: { str: 'abcdefg' },
    types: { TestStringTooLong: [{ key: 'str', type: 'string', max: 3 }] },
    name: 'TestStringTooLong',
    expect: false,
    info: 'can test if string is longer than max',
  },
  {
    props: { str: 'abcdefg' },
    types: { TestStringTooShort: [{ key: 'str', type: 'string', min: 124 }] },
    name: 'TestStringTooShort',
    expect: false,
    info: 'can test if string is shorter than min',
  },
  {
    props: { str: 'teststring' },
    types: { TestOneOfString: [{ key: 'str', type: 'string', oneOf: ['teststring'] }] },
    name: 'TestOneOfString',
    expect: true,
    info: 'oneOf works if true',
  },
  {
    props: { str: 'teststring' },
    types: { Test: [{ key: 'str', oneOf: ['teststring2'] }] },
    name: 'Test',
    expect: false,
    info: 'oneOf works if false',
  },
  {
    props: { arr: [1, 2, 3, 'testing'] },
    types: {
      TestArrayItemTypesTrue: [
        {
          key: 'arr',
          type: 'array',
          item: {
            type: ['string', 'number'],
          },
        },
      ],
    },
    name: 'TestArrayItemTypesTrue',
    expect: true,
    info: 'array item types work for strings and numbers in one array if true',
  },
  {
    props: { arr: [1, 2, 3, 'testing', false] },
    types: {
      TestArrayItemTypesFalse: [
        {
          key: 'arr',
          type: 'array',
          item: {
            type: ['string', 'number'],
          },
        },
      ],
    },
    name: 'TestArrayItemTypesFalse',
    expect: false,
    info: 'array item types work for strings and numbers in one array if false',
  },
  {
    props: { arr: ['testing', { str: 'string' }] },
    types: {
      TestArrayItemObjectTrue: [
        {
          key: 'arr',
          type: 'array',
          item: {
            type: ['string', 'object'],
            keys: [{ type: 'string', key: 'str' }],
          },
        },
      ],
    },
    name: 'TestArrayItemObjectTrue',
    expect: true,
    info: 'array item types work for strings and objects in one array if true',
  },
  {
    props: { arr: ['testing', { str: 123 }] },
    types: {
      TestArrayItemObjectTrue: [
        {
          key: 'arr',
          type: 'array',
          item: {
            type: ['string', 'object'],
            keys: [{ type: 'string', key: 'str' }],
          },
        },
      ],
    },
    name: 'TestArrayItemObjectMismatch',
    expect: false,
    info: 'array item types can check objcets for wrong values if false',
  },
  {
    props: { arr: ['testing', 1, 2, 3] },
    types: {
      TestArrayItemObjectFalse: [
        {
          key: 'arr',
          type: 'array',
          item: {
            type: ['string', 'object'],
            keys: [{ key: 'str', type: 'string' }],
          },
        },
      ],
    },
    name: 'TestArrayItemObjectFalse',
    expect: false,
    info: 'array item types work for strings and objects in one array if false',
  },

  {
    props: { str: 'str' },
    types: {
      ShouldNotLog: [{ key: 'str', type: 'string' }],
    },
    log: true,
    name: 'ShouldNotLog',
    expect: true,
    info: 'array item types work for strings and objects in one array if false',
  },
]

const errored = {}

const expectedErrors = {
  TestRequiredMissing: 1,
  TestRequiredEmptyObj: 1,
  TestRequiredNonEmptyObj: 1,
  TestRequiredEmptyArray: 1,
  TestStringFalse: 1,
  TestNumFalse: 1,
  TestIntFalse: 1,
  TestIntMax: 1,
  TestIntMin: 1,
  TestStringTooLong: 1,
  TestStringTooShort: 1,
  Test: 2,
  TestArrayItemTypesFalse: 1,
  expected: 1,
  TestArrayItemObjectFalse: 3,
}

const log = {
  error: err => {
    if (!err.msg) console.log(err)
    const name = err.msg.split(' ')[0]
    if (!errored.hasOwnProperty(name)) {
      errored[name] = 1
    } else {
      errored[name] += 1
    }
  },
}

export default {
  tests: [
    {
      fn: tryCatch(CHECK_PROPS, undefined, undefined, undefined, false),
      expect: is.err,
      info: 'without arguments errors',
    },
    // { fn: tryCatch(CHECK_PROPS, { key: false }, { key: 'boolean' }), expect: t => t[0].message.includes('expected Module name as third argument'), info: 'CHECK_PROPS without arguments errors with third arg error.' },
    {
      fn: tryCatch(CHECK_PROPS, undefined, undefined, undefined, false),
      expect: false,
      info: 'CHECK_PROPS without second argument errors and returns false.',
    },
    ...tests.map(t => ({
      fn: CHECK_PROPS(t.props, t.types, t.name, log),
      expect: t.expect,
      info: t.info,
    })),
  ],
  afterAll: () => {
    if (!is.deep.equal(errored, expectedErrors)) {
      console.error('log error messages did not match.', { errored, expectedErrors })
    }
  },
}
