import is from '@magic/types'

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

export const prepareMetaFiles = async (app, config) => {
  const res = {}

  const { CNAME, ROBOTS_TXT, SITEMAP, URL, WEB_ROOT } = config

  if (ROBOTS_TXT) {
    res['/robots.txt'] = [
      'user-agent: *',
      'allow: /',
      `sitemap: https://${URL}/sitemap.xml\n`,
    ].join('\n')
  }

  if (SITEMAP) {
    const sitemapArray = [sitemapHeader]

    app.pages
      .sort(({ name }, { name: n2 }) => (is.ln.gt(name, n2) || name > n2 ? 1 : -1))
      .forEach(({ name }) => {
        const now = new Date()
        let month = now.getMonth() + 1
        if (month < 10) {
          month = `0${month}`
        }

        let day = now.getDate()
        if (day < 10) {
          day = `0${day}`
        }

        const changeDate = `${now.getFullYear()}-${month}-${day}`

        sitemapArray.push(`
<url>
  <loc>https://${URL}${name.replace(WEB_ROOT, '/')}</loc>
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
    res['/CNAME'] = URL.trim()
  }

  return res
}
