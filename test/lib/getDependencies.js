const { is, tryCatch } = require('@magic/test')
const { getDependencies } = require('../../src/lib/')

const before = () => {
  if (!global.Module) {
    global.Module = () => {}
    global.ObjectModule = { View: () => {} }
  }
  if (!global.tags || !global.tags.body) {
    global.tags = {
      body: {},
    }
  }
}

module.exports = [
  {
    fn: tryCatch(getDependencies),
    expect: is.error,
    info: 'getDependencies without arguments throws',
  },
  {
    fn: tryCatch(getDependencies, ' NonModule.View,', new Set(['NonModule'])),
    expect: is.error,
    info: 'getDepencies without valid Component errors',
  },
  {
    before,
    fn: tryCatch(getDependencies, '() => Module()', new Set(['Module'])),
    expect: res => is.fn(res[0].Module),
    info: 'getDependencies finds Module if it is a function',
  },
  {
    before,
    fn: tryCatch(getDependencies, '() => ObjectModule.View()', new Set(['ObjectModule'])),
    expect: (res) => is.fn(res[0].ObjectModule.View),
    info: 'getDependencies finds ObjectModule',
  },
  {
    before,
    fn: tryCatch(getDependencies, '() => ObjectModule.View()', new Set(['ObjectModule'])),
    expect: res => is.object(res[0].ObjectModule),
    info: 'getDependencies finds ObjectModule.View',
  },
]
