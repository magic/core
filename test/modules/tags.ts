import { renderToString } from '@magic/hyperapp'
import { is } from '@magic/test'

import { tags } from '../../src/modules/tags.mjs'

export default [
  {
    fn: () => {
      // every tag is a prepared component function
      return (
        is.fn(tags.div) &&
        is.fn(tags.a) &&
        is.fn(tags.svg) &&
        is.fn(tags.meta) &&
        is.fn(tags.description)
      )
    },
    expect: true,
    info: 'tags prepares body, svg and head tags as components',
  },
  {
    fn: () => {
      const rendered = renderToString(tags.div({}, ['tag-content']))
      return rendered.includes('tag-content')
    },
    expect: true,
    info: 'prepared tags render',
  },
  {
    fn: () => {
      const rendered = renderToString(tags.description('a description'))
      return (
        rendered.includes('name="description"') &&
        rendered.includes('property="og:description"') &&
        rendered.includes('a description')
      )
    },
    expect: true,
    info: 'tags.description renders meta with name and og property',
  },
]
