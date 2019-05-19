import babel from '@babel/core'

import { runBabel } from '../../lib/index.mjs'

export default async clientString => {
  const babelOpts = await runBabel(config)

  const transformed = await babel.transform(clientString, babelOpts)
  return transformed
}
