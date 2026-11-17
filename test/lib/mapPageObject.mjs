import { is } from '@magic/test'

import { mapPageObject } from '../../src/lib/mapPageObject.mjs'

export default [
  {
    fn: mapPageObject({}, 'MODULES', {})(['MyModule', { key: 'value' }]),
    expect: is.object,
    info: 'mapPageObject returns an object',
  },
  {
    fn: mapPageObject({}, 'MODULES', {})(['MyModule', { key: 'value' }]),
    expect: { MODULES: { MyModule: { key: 'value' } } },
    info: 'mapPageObject adds module to MODULES key',
  },
  {
    fn: mapPageObject({ MODULES: { existing: true } }, 'MODULES', {})(['MyModule', {}]),
    expect: { MODULES: { existing: true, MyModule: {} } },
    info: 'mapPageObject adds module to existing MODULES object',
  },
  {
    fn: mapPageObject({ MODULES: { MyModule: 'existing' } }, 'MODULES', {})(['MyModule', 'new']),
    expect: { MODULES: { MyModule: 'existing' } },
    info: 'mapPageObject does not overwrite existing module',
  },
  {
    fn: mapPageObject({}, 'MODULES', { global: { MODULES: { MyModule: {} } } })([
      'MyModule',
      'value',
    ]),
    expect: {},
    info: 'mapPageObject skips global modules',
  },
  {
    fn: mapPageObject({}, 'MODULES', { global: {} })(['MyModule', 'value']),
    expect: { MODULES: { MyModule: 'value' } },
    info: 'mapPageObject adds module when global exists but not for this key',
  },
  {
    fn: mapPageObject({}, 'THEMES', { global: { THEMES: { dark: {} } } })(['dark', 'value']),
    expect: {},
    info: 'mapPageObject skips global theme',
  },
]
