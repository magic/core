export const View = state => {
  const { seo = {} } = state
  const {
    author,
    type = 'website',
    context = 'http://schema.org',
    name = state.title,
    custom = [],
  } = seo
  const description = Array.isArray(state.description)
    ? state.description.join(' ')
    : state.description
  const keywords = Array.isArray(state.keywords) ? state.keywords.join(' ') : state.keywords

  const favicon = state.favicon || `${config.WEB_ROOT}favicon.ico`
  const head = [link({ rel: 'icon', href: favicon })]

  const pageTitle = state.title || seo.name

  if (pageTitle) {
    head.push(title(pageTitle))
  }

  const pageImage = state.image || seo.image

  if (pageImage) {
    head.push(meta({ name: 'twitter:image', property: 'og:image', content: pageImage }))
    head.push(meta({ name: 'twitter:card', content: 'summary_large_image' }))
  }

  if (description) {
    head.push(
      meta({
        name: 'description',
        content: description,
      }),
    )
  }

  if (keywords) {
    head.push(
      meta({
        name: 'keywords',
        content: keywords,
      }),
    )
  }

  if (author) {
    let authorName = ''
    if (author.name) {
      authorName = state.seo.author.name
    } else if (author.givenName) {
      authorName = author.givenName
      if (author.additionalName) {
        authorName += ` ${author.additionalName}`
      }
      if (author.lastName) {
        authorName += ` ${author.lastName}`
      }
    }

    head.push(meta({ name: 'author', content: authorName }))
  }

  const openGraph = JSON.stringify({
    '@context': context,
    '@type': type,
    name,
    ...seo,
  })

  const props = {
    type: 'application/ld+json',
    innerHTML: openGraph,
  }

  head.push(script(props))

  custom.map(cus => {
    head.push(script(cus))
  })

  return head
}
