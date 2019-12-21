import { component } from './component.mjs'

import { bodyTags, headTags, svgTags } from '@magic/tags'

const exp = {}

bodyTags.forEach(name => {
  const prepared = component(name)
  exp[name] = prepared
})

headTags.forEach(name => {
  const prepared = component(name)
  exp[name] = prepared
})

const description = content => {
  exp.meta({ name: 'description', property: 'og:description', content })
}

exp.description = description

export const tags = exp
