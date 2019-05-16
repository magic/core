import { default as render } from 'hyperapp-render'
import { h } from 'hyperapp/src/index.mjs'

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

      // const rendered = applyWebRoot(
      //   config,
      //   render.renderToString(app.View(page, hashes)(state)),
      // )

      // console.log({ rendered })
      return {
        ...page,
        rendered,
      }
    } catch (e) {
      log.error(e, `Page url: ${page.name.replace(config.WEB_ROOT, '/')}`)
      process.exit(1)
    }
  })
