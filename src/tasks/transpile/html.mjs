import { renderToString } from 'hyperapp-render'

import log from '@magic/log'
import deep from '@magic/deep'

import { applyWebRoot } from '../../lib/index.mjs'

export default (app, hashes) =>
  app.pages.map(page => {
    try {
      app.state.url = page.name
      const state = deep.merge(page.state, app.state)
      const actions = deep.merge(page.actions, app.actions)
      const rendered = applyWebRoot(config, renderToString(app.View(page, hashes), state, actions))

      return {
        ...page,
        rendered,
      }
    } catch (e) {
      log.error(e, `Page url: ${page.name.replace(config.WEB_ROOT, '/')}`)
      process.exit(1)
    }
  })
