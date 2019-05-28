import { runConfig } from '../src/config.mjs'
import runApp from '../src/modules/app.mjs'
import * as tasks from '../src/tasks/index.mjs'

export default async () => {
  const config = await runConfig()

  const App = await runApp(config)

  const app = await tasks.prepare(App, config)
  // console.log(config, app)
}