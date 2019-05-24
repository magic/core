import { default as render } from 'hyperapp-render'
import { h } from 'hyperapp/src/index.js'

import log from '@magic/log'
import deep from '@magic/deep'

import { applyWebRoot } from '../../lib/index.mjs'

export default (app, hashes) =>
  app.pages.map(page => {
    try {
      app.state.url = page.name
      const state = deep.merge(page.state, app.state)
      const actions = deep.merge(page.actions, app.actions)

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
