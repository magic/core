// import fs from 'fs'
// import path from 'path'
// import babel from '@babel/core'

// const dataDir = path.join(process.cwd(), 'test', 'lib', 'babel', '.data', 'var')

// let actual

// const beforeAll = async () => {
  // const mockPath = path.join(dataDir, 'mock.js')
  // actual = await babel.transformFile(mockPath).code
// }

// export default {
  // beforeAll,
  // tests: [
    // { fn: actual, expect: a => !a.includes("const stripA = 'foo';") },
    // { fn: actual, expect: a => !a.includes("const stripBPattern = 'foo';") },
    // { fn: actual, expect: a => !a.includes('let stripC;') },
    // { fn: actual, expect: a => !a.includes('let stripFPattern;') },
    // { fn: actual, expect: a => !a.includes("stripC = 'foo';") },
    // { fn: actual, expect: a => !a.includes('stripC = {};') },
    // { fn: actual, expect: a => !a.includes("stripFPattern = 'foo';") },
    // { fn: actual, expect: a => !a.includes('stripFPattern = {};') },
    // { fn: actual, expect: a => !a.includes('export const stripG = {};') },
    // { fn: actual, expect: a => !a.includes('export const stripHPattern = {};') },
    // { fn: actual, expect: a => !a.includes('export { stripD };') },
    // { fn: actual, expect: a => !a.includes('export { stripIPattern };') },
    // { fn: actual, expect: a => !a.includes('export default { stripA') },
    // { fn: actual, expect: a => !a.includes('stripBPattern, keepBPattern };') },
    // { fn: actual, expect: a => !a.includes('console.log(stripA);') },
    // { fn: actual, expect: a => !a.includes('console.log(stripBPattern);') },
    // { fn: actual, expect: a => !a.includes('if (stripA') },
    // { fn: actual, expect: a => !a.includes('if (stripBPattern') },
    // { fn: actual, expect: a => !a.includes('if (stripC') },
    // { fn: actual, expect: a => !a.includes('if (stripFPattern') },
    // { fn: actual, expect: a => !a.includes('keepA = stripA;') },
    // { fn: actual, expect: a => !a.includes('keepB = stripB;') },

    // { fn: actual, expect: a => a.includes("const keepA = 'foo';") },
    // { fn: actual, expect: a => a.includes("const keepBPattern = 'foo';") },
    // { fn: actual, expect: a => a.includes('let keepC;') },
    // { fn: actual, expect: a => a.includes('let keepFPattern;') },
    // { fn: actual, expect: a => a.includes("keepC = 'foo';") },
    // { fn: actual, expect: a => a.includes("keepFPattern = 'foo';") },
    // { fn: actual, expect: a => a.includes('export const keepG = {};') },
    // { fn: actual, expect: a => a.includes('export const keepHPattern = {};') },
    // { fn: actual, expect: a => a.includes('export { keepD };') },
    // { fn: actual, expect: a => a.includes('export { keepIPattern };') },
    // { fn: actual, expect: a => a.includes('export default { keepA, keepBPattern };') },
    // { fn: actual, expect: a => a.includes('console.log(keepA);') },
    // { fn: actual, expect: a => a.includes('console.log(keepBPattern);') },
    // { fn: actual, expect: a => a.includes("if (keepA === 'foo') {}") },
    // { fn: actual, expect: a => a.includes("if (keepBPattern === 'foo') {}") },
    // { fn: actual, expect: a => a.includes("if (keepC === 'foo') {}") },
    // { fn: actual, expect: a => a.includes("if (keepFPattern === 'foo') {}") },
    // { fn: actual, expect: a => a.includes('keepB = keepB;') },
  // ],
// }
