import { httpGet } from './httpGet.mjs'
import { isPageUrl } from './isPageUrl.mjs'
import { isHashedUrl } from './isHashedUrl.mjs'

export const checkLinks = async (app, pages) => {
  const linkResolvers = app.links.map(async link => {
    if (link.startsWith(config.WEB_ROOT)) {
      if (isPageUrl(pages, link)) {
        return
      } else if (isHashedUrl(pages, link)) {
        return
      }
    } else {
      // TODO: http.get those links and check if they resolve
      try {
        const { statusCode } = await httpGet(link)

        if (statusCode === 200) {
          return
        } else {
          // console.log('unexpected statusCode', statusCode)
        }
      } catch (e) {
        // console.error(e)
      }
    }

    return link
  })

  const unresolvedLinks = await Promise.all(linkResolvers)
  const filteredUnresolvedLinks = unresolvedLinks.filter(a => a)
  if (filteredUnresolvedLinks.length) {
    log.error(
      'E_UNRESOLVED_LINKS',
      'links could not be resolved:',
      JSON.stringify(filteredUnresolvedLinks, null, 2),
    )
  }
}
