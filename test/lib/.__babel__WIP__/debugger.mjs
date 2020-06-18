import fs from '@magic/fs'
import path from 'path'
import babel from '@babel/core'

const dataDir = path.join(process.cwd(), '.test', 'lib', 'babel', '.data', 'debugger')

let actual

const debuggerMock = `
'use strict';
/* eslint-disable no-console */

const bar = 'foo';
let foo;

debugger;

if (bar === 'foo') {
    console.log(bar);
    debugger;
}

export { foo };
`

const options = {
  plugins: [
    [
      './src/lib/babel/remove_code.mjs',
      {
        debugger: true,
      },
    ],
  ],
}

const testBabel = async () => await babel.transform(debuggerMock, options).code

export default {
  tests: [
    { fn: testBabel, expect: a => !a.includes('debugger;'), info: 'removes debugger' },

    { fn: testBabel, expect: a => a.includes("const bar = 'foo';"), info: 'does not remove const' },
    { fn: testBabel, expect: a => a.includes('let foo;'), info: 'does not remove const' },
    { fn: testBabel, expect: a => a.includes("if (bar === 'foo') {"), info: 'does not remove if' },
    {
      fn: testBabel,
      expect: a => a.includes('export { foo };'),
      info: 'does not remove export { foo };',
    },
  ],
}
