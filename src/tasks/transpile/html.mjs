import { default as render } from 'hyperapp-render'

import log from '@magic/log'
import deep from '@magic/deep'

export default (app, hashes) => {
  app.state.root = config.WEB_ROOT

  return app.pages.map(page => {
    try {
      app.state.url = page.name
      const state = deep.merge(app.state, page.state)

      const view = app.View(page, hashes)

      let rendered = render.renderToString(view(state))

      if (config.WEB_ROOT !== '/') {
        rendered = rendered
          .split('href="')
          .map(s => {
            if (!s.startsWith('/') || s.startsWith(config.WEB_ROOT)) {
              return s
            }

            return config.WEB_ROOT.slice(0, -1) + s
          })
          .join('href="')
          .split('src="')
          .map(s => {
            if (!s.startsWith('/') || s.startsWith(config.WEB_ROOT)) {
              return s
            }

            return config.WEB_ROOT.slice(0, -1) + s
          })
          .join('src="')
      }

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
