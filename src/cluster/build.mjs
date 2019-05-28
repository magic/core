import runApp from '../modules/app.mjs'
import runCmd from './runCmd.mjs'

import { serve } from '../tasks/index.mjs'

export const build = async (cmds, config) => {
  const App = await runApp(config)
  const app = await runCmd('prepare', App, config)

  const { bundle, css, pages } = await runCmd('transpile', app)
  app.pages = pages
  app.css = css
  app.client = bundle.code

  if (cmds.build) {
    await runCmd('write', app)
  }

  if (cmds.serve) {
    serve(app)
  } else {
    process.send({ evt: 'quit' })
  }
}
