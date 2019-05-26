import babel from '@babel/core'

import { getBabelConf } from '../../lib/index.mjs'

export default async app => {
  const babelOpts = getBabelConf(app, config)

  const transformed = await babel.transform(app.client, babelOpts)
  return transformed
}
