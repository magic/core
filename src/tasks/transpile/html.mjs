import * as render from 'hyperapp-render'

import deep from '@magic/deep'
import log from '@magic/log'

export default ({ app, root }) => {
  app.state.root = root

  return app.pages.map(page => {
    try {
      app.state.url = page.name
      const state = deep.merge(app.state, page.state)

      const view = app.View(page, app.hashes)

      let rendered = render.renderToString(view(state))

      return {
        ...page,
        rendered,
      }
    } catch (e) {
      log.error('E_TRANSPILE_HTML', `Page url: ${page.name.replace(config.root, '/')}`, e)
      process.exit(1)
    }
  })
}
