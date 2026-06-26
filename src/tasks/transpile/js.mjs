import log from '@magic/log'

import { transformClient } from '../../lib/index.mjs'

export default async ({ app, config }) => {
  try {
    const code = await transformClient(app.client, app, config)

    // const sw = await transformClient(app.serviceWorker, app, config)
    return {
      code,
      // serviceWorker: sw.code,
    }
  } catch (e) {
    log.error('E_SWC', e)
  }
}
