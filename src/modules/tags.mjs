import { bodyTags, headTags, svgTags } from '@magic/tags'

import { component } from './component.mjs'

export const tags = {}

const prepareTag = name => {
  const prepared = component(name)
  tags[name] = prepared
}

bodyTags.forEach(prepareTag)

svgTags.forEach(prepareTag)

headTags.forEach(prepareTag)

tags.description = content =>
  tags.meta({ name: 'description', property: 'og:description', content })
