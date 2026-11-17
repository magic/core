import log from '@magic/log'

import runApp from '../modules/app.mjs'
import { serve } from '../tasks/index.mjs'
import runCmd from './runCmd.mjs'

/** @import { AppObject, Config } from '../types.mjs' */

/**
 * @param {{ commands: { [key: string]: unknown }, config: Config }} params
 * @returns {Promise<void>}
 */
export const build = async ({ commands, config }) => {
  try {
    const App = await runApp(config)
    let app = await runCmd('prepare', App, config)

    app = await runCmd('transpile', app, config)

    if (commands.build) {
      await runCmd('write', app, config)
    }

    if (commands.serve) {
      serve(/** @type {AppObject} */ (app), config)
    } else {
      process.send?.({ evt: 'quit' })
    }
  } catch (e) {
    log.error('E_MAGIC_BUILD', e)
  }
}
