// import fs from '@magic/fs'
// import path from 'path'
// import babel from '@babel/core'

// const dataDir = path.join(process.cwd(), 'test', 'lib', 'babel', '.data', 'export')

// let actual

// console.log({ babel })

// const beforeAll = async () => {
  // const mockPath = path.join(dataDir, 'mock.js')
  // actual = await babel.transformAsync(mockPath).code
// }

// export default {
  // beforeAll,
  // tests: [
    // { fn: actual, expect: a => !a.includes('export const stripA') },
    // { fn: actual, expect: a => !a.includes('export const stripBPattern') },
    // { fn: actual, expect: a => !a.includes('export { stripC }') },
    // { fn: actual, expect: a => !a.includes('export { stripDPattern }') },
    // { fn: actual, expect: a => !a.includes('export default { stripE') },
    // { fn: actual, expect: a => !a.includes('keepE, stripFPattern') },
    // { fn: actual, expect: a => a.includes('export const keepA') },
    // { fn: actual, expect: a => a.includes('export const keepBPattern') },
    // { fn: actual, expect: a => a.includes('export { keepC') },
    // { fn: actual, expect: a => a.includes('export { keepDPattern') },
    // { fn: actual, expect: a => a.includes('export default { keepE, keepFPattern };') },
  // ],
// }
