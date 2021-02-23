import log from '@magic/log'

import { httpGet } from './httpGet.mjs'
import { isPageUrl } from './isPageUrl.mjs'
import { isHashedUrl } from './isHashedUrl.mjs'
import { isStaticUrl } from './isStaticUrl.mjs'

const redirectStatusCodes = [301, 302, 303, 307, 308]

export const checkLinks = async ({ staticUrls, links, pages, noRemote = false, root }) => {
  const linkResolvers = links.map(async link => {
    if (link.startsWith(root)) {
      if (isPageUrl(pages, link)) {
        return
      } else if (isHashedUrl(pages, link)) {
        return
      } else if (isStaticUrl(staticUrls, link, root)) {
        return
      }
    } else {
      if (noRemote) {
        return
      }

      // TODO: http.get those links and check if they resolve
      const { statusCode, headers, error } = await httpGet(link)

      if (statusCode === 200) {
        return
      } else if (redirectStatusCodes.includes(statusCode)) {
        if (headers.location) {
          log.warn(
            'W_CHECKLINKS_REDIRECT',
            'There is a link in your app that is getting redirected.\nto make this warning disappear: change:',
            link,
            'to:',
            headers.location,
          )
          return
        } else {
          log.warn(
            'W_CHECKLINKS_REDIRECT',
            'Weird http redirect. Please file an issue: https://github.com/magic/core/issues/',
            { statusCode, headers },
          )
          return
        }
      } else if (error) {
        if (error.code === 'EAI_AGAIN') {
          log.error('E_CHECKLINKS_HOSTNAME_NOT_FOUND', 'could not resolve hostname:', link)

          return
        }
      } else if (statusCode === 404) {
        log.error('E_CHECKLINKS_404', '404 not found for link:', link)
        return
      }
    }

    return link
  })

  const unresolvedLinks = await Promise.all(linkResolvers)

  const filteredUnresolvedLinks = unresolvedLinks.filter(a => a)
  if (filteredUnresolvedLinks.length) {
    log.error(
      'E__CHECKLINKS_UNRESOLVED',
      'links could not be resolved:',
      JSON.stringify(filteredUnresolvedLinks, null, 2),
    )
  }

  return filteredUnresolvedLinks
}
