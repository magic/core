import log from '@magic/log'
import is from '@magic/types'

import { httpGet } from './httpGet.mjs'
import { isPageUrl } from './isPageUrl.mjs'
import { isHashedUrl } from './isHashedUrl.mjs'
import { isStaticUrl } from './isStaticUrl.mjs'

/** @import { NodeError, PageObject } from '../types.mjs' */

const redirectStatusCodes = [301, 302, 303, 307, 308]

/**
 * @param {{ staticUrls: string[], links: string[], pages: PageObject[], ignoredLinks?: string[], noRemote?: boolean, root: string | undefined, dev?: boolean }} params
 * @returns {Promise<string[]>}
 */
export const checkLinks = async ({
  staticUrls,
  links,
  pages,
  ignoredLinks = [],
  noRemote = false,
  root,
  dev,
}) => {
  const linkResolvers = links.map(async link => {
    if (link.startsWith(String(root))) {
      if (isPageUrl(pages, link)) {
        return
      } else if (isHashedUrl(pages, link)) {
        return
      } else if (isStaticUrl(staticUrls, link, root)) {
        return
      }
    } else if (link.startsWith('mailto:')) {
      return
    } else if (link.includes('://') || link.startsWith('//')) {
      if (noRemote || dev || ignoredLinks.includes(link)) {
        return
      }

      const { statusCode, headers, error } = await httpGet(link)

      if (statusCode === 200) {
        return
      } else if (statusCode !== undefined && redirectStatusCodes.includes(statusCode)) {
        if (headers && headers.location) {
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
        if (/** @type {NodeError} */ (error).code === 'EAI_AGAIN') {
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
  const filteredUnresolvedLinks = unresolvedLinks.filter(a => is.string(a))

  if (filteredUnresolvedLinks.length) {
    log.error(
      'E__CHECKLINKS_UNRESOLVED',
      'links could not be resolved:',
      JSON.stringify(filteredUnresolvedLinks, null, 2),
    )
  }

  return filteredUnresolvedLinks
}
