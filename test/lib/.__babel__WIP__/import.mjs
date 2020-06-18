// import fs from '@magic/fs'
// import path from 'path'
// import babel from '@babel/core'

// const dataDir = path.join(process.cwd(), 'test', 'lib', 'babel', '.data', 'import')

// let actual

// const beforeAll = async () => {
  // const mockPath = path.join(dataDir, 'mock.js')
  // actual = await babel.transformFile(mockPath).code
// }

// export default () => ({
  // beforeAll,
  // tests: {
    // imports: [
      // { fn: actual, expect: a => !a.includes('import { fsA } from "stripA"') },
      // { fn: actual, expect: a => !a.includes('import { fsB } from "stripBPattern"') },
      // { fn: actual, expect: a => !a.includes('fsB(') },
      // { fn: actual, expect: a => !a.includes('import fsC from "stripC"') },
      // { fn: actual, expect: a => !a.includes('console.log(fsC)') },
      // { fn: actual, expect: a => !a.includes('import fsD from "stripDPattern"') },
      // { fn: actual, expect: a => !a.includes('const fsDVar = fsD') },
      // { fn: actual, expect: a => !a.includes('import { fsEProxy as fsE } from "stripE"') },
      // { fn: actual, expect: a => !a.includes('import { fsFProxy as fsF } from "stripFPattern"') },
      // { fn: actual, expect: a => !a.includes('import "stripG"') },
      // { fn: actual, expect: a => !a.includes('import "stripHPattern"') },
      // { fn: actual, expect: a => !a.includes('const keepI = fsF(fkF())') },
      // { fn: actual, expect: a => !a.includes('const keepJ = fkF(fsF())') },
      // { fn: actual, expect: a => !a.includes('stripK1, stripK2') },
      // { fn: actual, expect: a => !a.includes('stripK1(stripK2())') },
    // ],
    // vars: [
      // { fn: actual, expect: a => a.includes('import { fkA } from "keepA"') },
      // { fn: actual, expect: a => a.includes('import { fkB } from "keepBPattern"') },
      // { fn: actual, expect: a => a.includes("fkB('foo')") },
      // { fn: actual, expect: a => a.includes('import fkC from "keepC"') },
      // { fn: actual, expect: a => a.includes('console.log(fkC)') },
      // { fn: actual, expect: a => a.includes('import fkD from "keepDPattern"') },
      // { fn: actual, expect: a => a.includes('const fkDVar = fkD') },
      // { fn: actual, expect: a => a.includes('import { fkEProxy as fkE } from "keepE"') },
      // { fn: actual, expect: a => a.includes('import { fkFProxy as fkF } from "keepFPattern"') },
      // { fn: actual, expect: a => a.includes('import "keepG";') },
      // { fn: actual, expect: a => a.includes('import "keepHPattern"') },
      // { fn: actual, expect: a => a.includes('const keepI;') },
      // { fn: actual, expect: a => a.includes('const keepJ = fkF()') },
      // { fn: actual, expect: a => a.includes('{ keepK1, keepK2 } from "keepK') },
      // { fn: actual, expect: a => a.includes('keepK1(keepK2())') },
    // ],
  // },
// })
