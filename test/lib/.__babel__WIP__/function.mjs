// import fs from '@magic/fs'
// import path from 'path'
// import babel from '@babel/core'

// const dataDir = path.join(process.cwd(), 'test', 'lib', 'babel', '.data', 'function')

// let actual

// const beforeAll = async () => {
  // const mockPath = path.join(dataDir, 'mock.js')
  // actual = await babel.transformAsync(mockPath).code

  // await fs.writeFileSync(path.join(dataDir, '_tmp_test.js'), actual, { encoding: 'UTF-8' })
// }

// export default {
  // beforeAll,
  // tests: [
    // { fn: actual, expect: a => !a.includes('function stripA') },
    // { fn: actual, expect: a => !a.includes('const keepB = function stripB') },

    // { fn: actual, expect: a => !a.includes('function stripA') },
    // { fn: actual, expect: a => !a.includes('const keepB = function stripB') },

    // { fn: actual, expect: a => !a.includes('stripA()') },
    // { fn: actual, expect: a => !a.includes("console.keepC.stripC('foo')") },
    // { fn: actual, expect: a => !a.includes("console.stripD('bar')") },
    // { fn: actual, expect: a => !a.includes("console.stripD.keepD('bar')") },
    // { fn: actual, expect: a => !a.includes('stripA(keepC())') },
    // { fn: actual, expect: a => !a.includes('keepC(stripA())') },

    // { fn: actual, expect: a => a.includes('function keepA') },
    // { fn: actual, expect: a => a.includes('const keepB') },
    // { fn: actual, expect: a => a.includes("console.keepC('foo')") },
    // { fn: actual, expect: a => a.includes('keepC()') },
  // ],
// }
