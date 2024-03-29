import log from '@magic/log'

import swc from '@swc/core'

import { getSwcConf } from '../../lib/index.mjs'

export default async ({ app, config }) => {
  const swcOpts = getSwcConf(app, config)
  try {
    const { code } = await swc.transform(app.client, swcOpts)

    // const sw = await swc.transform(app.serviceWorker, swcOpts)
    return {
      code,
      // serviceWorker: sw.code,
    }
  } catch (e) {
    log.error('E_SWC', e)
  }
}
