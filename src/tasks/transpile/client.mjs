import babel from '@babel/core'

import { runBabel } from '../../lib/index.mjs'

export default async app => {
  const babelOpts = await runBabel(app, config)

  const transformed = await babel.transform(app.client, babelOpts)
  return transformed
}
