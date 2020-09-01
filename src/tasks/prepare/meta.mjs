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

export const prepareMetaFiles = async app => {
  const res = {}

  const remote = config.URL

  if (config.ROBOTS_TXT) {
    res['/robots.txt'] = [
      'user-agent: *',
      'allow: /',
      `sitemap: https://${remote}/sitemap.xml\n`,
    ].join('\n')
  }

  if (config.SITEMAP) {
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
  <loc>https://${config.URL}${name.replace(config.WEB_ROOT, '/')}</loc>
  <lastmod>${changeDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.5</priority>
</url>
`)
      })

    sitemapArray.push(sitemapFooter)

    res['/sitemap.xml'] = sitemapArray.join('').trim()
  }

  if (config.CNAME) {
    res['/CNAME'] = config.URL.trim()
  }

  return res
}
