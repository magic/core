import log from '@magic/log'

import { replaceSlashSlash } from './replaceSlashSlash.mjs'

export const handleLink = ({ app, href, parent = {} }) => {
  if (href.startsWith(config.WEB_ROOT)) {
    href = replaceSlashSlash(href)
    app.links.push(href)
    return href
  }

  if (href.startsWith('/#')) {
    href = href.substr(1)
  }

  let local = false

  if (href.startsWith('/') && !href.startsWith('//')) {
    local = true

    if (!href.startsWith(config.WEB_ROOT)) {
      href = `${config.WEB_ROOT}${href.substr(1)}`
    }
  } else if (href.startsWith('#')) {
    local = true

    if (parent.to) {
      href = `${parent.to}/${href}`
    } else {
      href = `${config.WEB_ROOT}/${href}`
    }
  } else if (href.startsWith('-')) {
    if (parent.to) {
      local = true
      // no slash!
      href = `${parent.to}${href}`
    } else {
      log.error(
        'E_PREPARE_STATE_LINKS_EXPANDED_LINK',
        'an expanded Link without Parent was found:',
        href,
        parent,
      )
    }
  } else if (!href.startsWith('http') && !href.startsWith('//')) {
    log.error(
      'E_PREPARE_STATE_LINKS_UNKNOWN_HREF',
      '@magic did not handle this href. Please file a bug at https://github.com/magic/core/issues',
      href,
      parent,
    )
  }

  if (local) {
    href = replaceSlashSlash(href)
  } else {
    if (href.startsWith('//')) {
      href = `//${replaceSlashSlash(href.substr(2))}`
    } else {
      href = href
        .split('://')
        .map(a => replaceSlashSlash(a))
        .join('://')
    }
  }

  app.links.push(href)

  return href
}

// export const handleLink = (val, app) => {
//   if (!val.startsWith(config.WEB_ROOT)) {
//     if (val.startsWith('/') || val.startsWith('#') || val.startsWith('/#')) {
//       val = replaceSlashSlash(`${config.WEB_ROOT}${val}`)
//     }
//   }

//   app.links.push(val)
//   return val
// }
