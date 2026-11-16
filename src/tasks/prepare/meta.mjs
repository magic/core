import is from '@magic/types'

import { replaceSlashSlash } from '../../lib/index.mjs'

/** @import { AppObject, Config } from '../../types.mjs' */

const sitemapHeader = `
<?xml version='1.0' encoding='UTF-8'?>
<urlset
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
`
const sitemapFooter = `
</urlset>
`

/**
 * @param {AppObject} app
 * @param {Config} config
 * @returns {Promise<Record<string, string>>}
 */
export const prepareMetaFiles = async (app, config) => {
  /** @type {Record<string, string>} */
  const res = {}

  const { CNAME, ROBOTS_TXT, SITEMAP, URL, WEB_ROOT } = config

  if (ROBOTS_TXT) {
    const sitemapUrl = replaceSlashSlash(`https://${URL}/sitemap.xml`)

    res['/robots.txt'] = ['user-agent: *', 'allow: /', `sitemap: ${sitemapUrl}\n`].join('\n')
  }

  if (SITEMAP) {
    const sitemapArray = [sitemapHeader]

    ;(app.pages ?? [])
      .sort(({ name }, { name: n2 }) => (is.ln.gt(name, n2) || (name ?? '') > (n2 ?? '') ? 1 : -1))
      .forEach(({ name }) => {
        const now = new Date()
        let month = String(now.getMonth() + 1)
        if (Number(month) < 10) {
          month = `0${month}`
        }

        let day = String(now.getDate())
        if (Number(day) < 10) {
          day = `0${day}`
        }

        const changeDate = `${now.getFullYear()}-${month}-${day}`

        const sitemapItemUrl = `https://${replaceSlashSlash(`${URL}${String(name).replace(String(WEB_ROOT), '/')}`)}`

        sitemapArray.push(`
<url>
  <loc>${sitemapItemUrl}</loc>
  <lastmod>${changeDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.5</priority>
</url>
`)
      })

    sitemapArray.push(sitemapFooter)

    res['/sitemap.xml'] = sitemapArray.join('').trim()
  }

  if (CNAME) {
    res['/CNAME'] = String(URL).trim()
  }

  return res
}
