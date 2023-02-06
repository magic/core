import { config as swcConfig } from '@swc/core/spack.js'

import { visit, used } from './visit.mjs'

const plugin = (app, config) => m => {
  const n = m

  // console.log('used before', used)

  n.body = m.body.map(item => visit({ parent: item, app, config }))

  // console.log('used after', used)

  app.modules = Object.fromEntries(
    Object.entries(app.modules).filter(([name, mod]) => {
      if (!used.modules.has(name)) {
        return false
      }
      return true
    }),
  )

  // console.log('after', Object.keys(app.modules).length)

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
