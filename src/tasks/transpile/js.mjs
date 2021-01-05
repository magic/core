import babel from '@babel/core'
import swc from '@swc/core'

import { getBabelConf } from '../../lib/index.mjs'

export default async app => {
  if (config.ENV === 'development') {
    const swcOpts = {
      // Some options cannot be specified in .swcrc
      filename: `${config.BABEL.CLIENT_LIB_NAME}.js`,

      sourceMaps: true,
      // Input files are treated as module.
      isModule: true,

      // All options below can be configured via .swcrc
      jsc: {
        parser: {
          syntax: 'ecmascript',
        },
        transform: {},
      },
    }

    const { code } = await swc.transform(app.client, swcOpts)
    // const sw = await swc.transform(app.serviceWorker, swcOpts)
    return {
      code,
      // serviceWorker: sw.code,
    }
  } else {
    const babelOpts = getBabelConf(app, config)

    const { code } = await babel.transform(app.client, babelOpts)
    // const sw = await babel.transform(app.serviceWorker, babelOpts)

    return {
      code,
      //serviceWorker: sw.code,
    }
  }
}
