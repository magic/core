import swc from '@swc/core'

import { getSwcConf } from '../../lib/index.mjs'

export default async ({ app, config }) => {
  if (app.dependencies) {
    console.log('Should transpile bundle')
    return {
      code: 'console.log("ohai")',
    }
  }
  const swcOpts = getSwcConf(app, config)
  const { code } = await swc.transform(app.client, swcOpts)

  // const sw = await swc.transform(app.serviceWorker, swcOpts)
  return {
    code,
    // serviceWorker: sw.code,
  }
}
