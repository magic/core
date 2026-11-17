import deep from '@magic/deep'
import { renderToString } from '@magic/hyperapp'
import log from '@magic/log'
import is from '@magic/types'

import { replaceSlashSlash } from '../../lib/replaceSlashSlash.mjs'

/** @import { AppObject, PageObject } from '../../types.mjs' */

/**
 * @param {{ app: AppObject, root: string | undefined }} params
 * @returns {PageObject[]}
 */
export default ({ app, root }) => {
  if (!app.state) {
    app.state = {}
  }
  const state = app.state
  state.root = root

  return (app.pages ?? []).map(page => {
    try {
      state.url = page.name
      const mergedState = deep.merge(state, page.state)

      const view = app.View(page, app.hashes ?? {})

      const pageObj = view(mergedState)

      let rendered = renderToString(pageObj)

      // dirty url cleanup. makes all local urls in html files point to WEB_ROOT
      const tags = ['href', 'src']
      tags.map(tag => {
        const urlsTangle = rendered.split(`${tag}="`)

        const urls = urlsTangle
          .map(url => {
            url = url.split('"')[0]
            if (url.startsWith('/') && !url.startsWith(String(root))) {
              return [url, replaceSlashSlash(`${String(root)}/${url}`)]
            }
          })
          .filter(a => is.array(a))

        urls.forEach(([oldUrl, newUrl]) => {
          rendered = rendered.replace(new RegExp(`${tag}="${oldUrl}"`, 'gim'), `${tag}="${newUrl}"`)
        })
      })

      return {
        ...page,
        rendered,
      }
    } catch (e) {
      log.error('E_TRANSPILE_HTML', `Page url: ${String(page.name).replace(String(root), '/')}`, e)
      process.exit(1)
    }
  })
}
