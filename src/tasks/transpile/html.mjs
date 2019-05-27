import { default as render } from 'hyperapp-render'

import log from '@magic/log'
import deep from '@magic/deep'

export default (app, hashes) => {
  app.state.root = config.WEB_ROOT

  return app.pages.map(page => {
    try {
      app.state.url = page.name
      const state = deep.merge(page.state, app.state)

      const view = app.View(page, hashes)

      const rendered = render.renderToString(view(state))

      return {
        ...page,
        rendered,
      }
    } catch (e) {
      log.error(e, `Page url: ${page.name.replace(config.WEB_ROOT, '/')}`)
      process.exit(1)
    }
  })
}
