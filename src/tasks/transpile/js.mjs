import deep from '@magic/deep'

import babel from '@babel/core'
import swc from '@swc/core'

import { getBabelConf, getSwcConf } from '../../lib/index.mjs'

export default async ({ app, config }) => {
  if (config.ENV === 'development') {
    const swcOpts = getSwcConf(app, config)
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
