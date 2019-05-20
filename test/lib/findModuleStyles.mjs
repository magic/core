import { is } from '@magic/test'

import { findModuleStyles } from '../../src/lib/index.mjs'

const exampleModules = {
  Module: {
    style: {
      color: 'green',
    },
  },
  ModuleOther: {},
}
const expectExampleModules = { '.Module': { color: 'green' } }

const moduleWithFnStyle = {
  Module: {
    style: vars => ({
      color: vars.color,
    }),
  },
}

const moduleWithMedia = {
  Module: {
    style: {
      '@media screen': {
        color: 'green',
      },
    },
  },
}

const moduleWithMediaExpect = { '@media screen': { '.Module': { color: 'green' } } }

const moduleWithSubModule = {
  Module: {
    ModuleSubModule: {
      style: {
        color: 'green',
      },
    },
  },
}

const expectModuleWithSubmodule = { '.ModuleSubModule': { color: 'green' } }

export default [
  { fn: findModuleStyles(exampleModules), expect: is.object },
  { fn: findModuleStyles(exampleModules), expect: is.deep.equal(expectExampleModules) },
  {
    fn: findModuleStyles(moduleWithFnStyle, { color: 'green' }),
    expect: is.deep.equal(expectExampleModules),
  },
  { fn: findModuleStyles(moduleWithMedia), expect: is.deep.equal(moduleWithMediaExpect) },
  // { fn: findModuleStyles(moduleWithSubModule), expect: is.deep.equal(expectModuleWithSubmodule) },
]
