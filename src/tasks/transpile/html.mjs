import { renderToString } from '@magic/hyperapp'

import deep from '@magic/deep'
import log from '@magic/log'

import { replaceSlashSlash } from '../../lib/replaceSlashSlash.mjs'

export default ({ app, root }) => {
  app.state.root = root

  return app.pages.map(page => {
    try {
      app.state.url = page.name
      const state = deep.merge(app.state, page.state)

      const view = app.View(page, app.hashes)

      let rendered = renderToString(view(state))

      // dirty url cleanup. makes all local urls in html files point to WEB_ROOT
      const tags = ['href', 'src']
      tags.map(tag => {
        const urlsTangle = rendered.split(`${tag}="`)

        const urls = urlsTangle
          .map(url => {
            url = url.split('"')[0]
            if (url.startsWith('/') && !url.startsWith(root)) {
              return [url, replaceSlashSlash(`${root}/${url}`)]
            }
          })
          .filter(a => a)

        urls.forEach(([oldUrl, newUrl]) => {
          rendered = rendered.replace(new RegExp(`${tag}="${oldUrl}"`, 'gim'), `${tag}="${newUrl}"`)
        })
      })

      return {
        ...page,
        rendered,
      }
    } catch (e) {
      log.error('E_TRANSPILE_HTML', `Page url: ${page.name.replace(root, '/')}`, e)
      process.exit(1)
    }
  })
}
