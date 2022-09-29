import { is } from '@magic/test'

import { isModuleName } from '../../src/lib/index.mjs'

export default [
  { fn: isModuleName('noModule'), expect: is.boolean, info: '"noModule" returns a boolean' },
  { fn: isModuleName('Module'), expect: is.boolean, info: '"Module" returns a boolean' },
  { fn: isModuleName('noModule'), expect: false, info: 'noModule is not a module name' },
  { fn: isModuleName('Module'), info: 'Module is a module name' },
]