import { bodyTags, headTags, svgTags } from '@magic/tags'

import { component } from './component.mjs'

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

const oldA = exp.a
exp.a = (props, children) => {
  const { to, text = '', ...p } = props
  if (to) {
    p.href = to
  }

  oldA(p, children.length ? children : text)
}

export const tags = exp
