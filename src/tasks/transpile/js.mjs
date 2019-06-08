import babel from '@babel/core'

import { getBabelConf } from '../../lib/index.mjs'

export default async app => {
  const babelOpts = getBabelConf(app, config)

  const bundle = await babel.transform(app.client, babelOpts)
  // const serviceWorker = await babel.transform(app.serviceWorker, babelOpts)

  return {
    bundle,
    // serviceWorker,
  }
}
