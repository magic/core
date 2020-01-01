import { component } from './component.mjs'

import { bodyTags, headTags, svgTags } from '@magic/tags'

const exp = {}

const prepareTag = name => {
  const prepared = component(name)
  exp[name] = prepared
}

bodyTags.forEach(prepareTag)

svgTags.forEach(prepareTag)

headTags.forEach(prepareTag)

const description = content => {
  exp.meta({ name: 'description', property: 'og:description', content })
}

exp.description = description

export const tags = exp
