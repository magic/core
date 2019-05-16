import runApp from '../modules/app.mjs'
import runCmd from './runCmd.mjs'

import { serve } from '../tasks/index.mjs'

export const build = async (cmds, config) => {
  const App = await runApp(config)
  const app = await runCmd('prepare', App)

  const { pages, bundle, css } = await runCmd('transpile', app)
  app.pages = pages
  app.client.bundle = bundle
  app.css = css

  if (cmds.build) {
    await runCmd('write', app)
  }

  if (cmds.serve) {
    serve(app)
  } else {
    process.send({ evt: 'quit' })
  }
}
