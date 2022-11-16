import { config as swcConfig } from '@swc/core/spack.js'

import { visit } from './visit.mjs'

const plugin = (app, config) => m => {
  if (!m) {
    return
  }

  const n = m

  n.body = m.body.map(item => visit({ parent: item, app, config }))

  /*
   * this gets handled fine by swc and dead code elimination
   */
  // const unusedTopLevel = []
  // Object.keys(declarations.declared).map(key => {
  //   if (!declarations.used[key]) {
  //     unusedTopLevel.push(key)
  //   }
  // })

  // app.modules = Object.fromEntries(Object.entries(app.modules).filter(([name, mod]) => {
  //   if (unusedTopLevel.includes(name)) {
  //     return false
  //   }
  //   return true
  // }))

  return n
}

export const getSwcConf = (app, config) => {
  const fileName = `${config.CLIENT_LIB_NAME}.js`

  let minify = {
    compress: {
      unused: true,
    },
    mangle: false,
  }

  if (config.IS_PROD) {
    minify.compress = true
    minify.mangle = true
    minify.format = {
      comments: false,
    }
  }

  return swcConfig({
    // Some options cannot be specified in .swcrc
    filename: fileName,

    // TODO: actually write those into files during dev
    sourceMaps: config.IS_DEV,

    // Input files are treated as module.
    isModule: true,

    // All options below can be configured via .swcrc
    jsc: {
      parser: {
        syntax: 'typescript',
      },
      transform: {},
      minify,
    },
    minify: true,

    plugin: plugin(app, config),
  })
}
