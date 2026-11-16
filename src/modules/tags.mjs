import { bodyTags, headTags, svgTags } from '@magic/tags'

import { component } from './component.mjs'

/** @import { Tag } from '../types.mjs' */

/** @type {{ [key: string]: Tag }} */
export const tags = {}

/**
 * @param {string} name
 */
const prepareTag = name => {
  const prepared = component(name)
  tags[name] = prepared
}

bodyTags.forEach(prepareTag)

svgTags.forEach(prepareTag)

headTags.forEach(prepareTag)

/**
 * @param {unknown} content
 */
tags.description = content =>
  tags.meta({ name: 'description', property: 'og:description', content })
