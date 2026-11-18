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

    if (app instanceof Error) {
      log.error('E_PREPARE', app)
      process.send?.({ evt: 'failed', error: app.toString() })
      return
    }

    app = await runCmd('transpile', app, config)

    if (app instanceof Error) {
      log.error('E_TRANSPILE', app)
      process.send?.({ evt: 'failed', error: app.toString() })
      return
    }

    if (commands.build) {
      const writeResult = await runCmd('write', app, config)

      if (writeResult instanceof Error) {
        log.error('E_WRITE', writeResult)
        process.send?.({ evt: 'failed', error: writeResult.toString() })
        return
      }
    }

    if (commands.serve) {
      serve(/** @type {AppObject} */ (app), config).catch(e => {
        log.error('E_SERVE', e)
        process.send?.({ evt: 'failed', error: String(e) })
      })
    } else {
      process.send?.({ evt: 'quit' })
    }
  } catch (e) {
    log.error('E_MAGIC_BUILD', e)
  }
}
