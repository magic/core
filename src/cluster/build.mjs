import log from '@magic/log'

import runApp from '../modules/app.mjs'
import runCmd from './runCmd.mjs'

import { serve } from '../tasks/index.mjs'

export const build = async ({ commands, config }) => {
  try {
    const App = await runApp(config)
    const app = await runCmd('prepare', App, config)

    const { bundle, css, pages /*, serviceWorker */ } = await runCmd('transpile', app, config)
    app.pages = pages
    app.css = css
    app.client = bundle.code
    // app.sw = serviceWorker.code

    if (commands.build) {
      await runCmd('write', app, config)
    }

    if (commands.serve) {
      serve(app)
    } else {
      process.send({ evt: 'quit' })
    }
  } catch (e) {
    log.error('error during build', e)
    process.exit(1)
  }
}
