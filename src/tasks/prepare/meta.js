const log = require('@magic/log')
const { xc } = require('../../lib')

const sitemapHeader = `
<?xml version='1.0' encoding='UTF-8'?>
<urlset
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
const sitemapFooter = '</urlset>'

const prepareMetaFiles = async app => {
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
    const sitemap = [sitemapHeader]

    app.pages.forEach(({ name }) => {
      console.log({ name })
    })

    sitemap.push(sitemapFooter)
  }

  if (config.CNAME) {
    res['/CNAME'] = config.CNAME.trim()
  }

  return res
}

module.exports = prepareMetaFiles
