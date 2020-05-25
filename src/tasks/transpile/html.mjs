import * as render from 'hyperapp-render'

import deep from '@magic/deep'
import log from '@magic/log'

const maybePrependWebRoot = s => {
  // non local links or already webrooted links
  if (!s.startsWith('/') || s.startsWith(config.WEB_ROOT)) {
    return s
  }

  // prepend WEB_ROOT to link
  return config.WEB_ROOT.slice(0, -1) + s
}

export default app => {
  app.state.root = config.WEB_ROOT

  return app.pages.map(page => {
    try {
      app.state.url = page.name
      const state = deep.merge(app.state, page.state)

      const view = app.View(page, app.hashes)

      let rendered = render.renderToString(view(state))

      if (config.WEB_ROOT !== '/') {
        rendered = rendered
          .split('href="')
          .map(maybePrependWebRoot)
          .join('href="')
          .split('src="')
          .map(maybePrependWebRoot)
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
