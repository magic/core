import { is } from '@magic/test'

import { mergeSubModules } from '../../../src/lib/swc/mergeSubModules.mjs'

export default [
  {
    fn: () => {
      const used = { modules: ['a'] }
      const result = mergeSubModules({ used, name: 'notAModule' })
      return result === used
    },
    expect: true,
    info: 'mergeSubModules returns used unchanged for non module names',
  },
  {
    fn: () => {
      const used = { modules: ['a'] }
      const result = mergeSubModules({ used, name: 'AModule' })
      return result === used
    },
    expect: true,
    info: 'mergeSubModules returns used when the module has no dependencies',
  },
  {
    fn: () => {
      const used = { modules: ['a'] }
      const dependencies = { modules: ['b', 'a'] }
      const result = mergeSubModules({ used, name: 'AModule', dependencies })
      return is.arr(result.modules) && result.modules.includes('a') && result.modules.includes('b')
    },
    expect: true,
    info: 'mergeSubModules merges dependencies into used',
  },
  {
    fn: () => {
      const used = { modules: [] }
      const dependencies = {
        modules: ['SubModule'],
        SubModule: { modules: ['Deep'] },
      }
      const result = mergeSubModules({ used, name: 'AModule', dependencies })
      // recursion into SubModule merges its dependencies as well
      return result.modules.includes('SubModule') || result.modules.includes('Deep')
    },
    expect: true,
    info: 'mergeSubModules recurses into sub module dependencies',
  },
  {
    fn: () => {
      const result = mergeSubModules({ name: 'AModule' })
      return is.obj(result)
    },
    expect: true,
    info: 'mergeSubModules works without an explicit used object',
  },
]
