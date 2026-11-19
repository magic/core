import { has } from '@magic/test'

import { View as BlogArchiveView } from '../../src/modules/BlogArchive.mjs'
import { View as BlogMonthView } from '../../src/modules/BlogMonth.mjs'
import { View as BlogYearView } from '../../src/modules/BlogYear.mjs'

const blog = {
  2024: {
    Jan: {
      '01': [
        {
          name: '/blog/test-post',
          state: { title: 'Test Post', description: 'A test post', name: '/blog/test-post' },
        },
      ],
    },
  },
}

const baseState = {
  blog,
  url: '/blog/2024/',
  year: '2024',
}

export default {
  blogMonth: [
    {
      fn: div([BlogMonthView({ ...baseState, month: 'Jan' })]),
      expect: has.string('Jan', '2024', 'Test Post'),
      info: 'BlogMonth renders month, year and post title without link',
    },
    {
      fn: div([BlogMonthView({ ...baseState, month: 'Jan', link: '/blog/2024/' })]),
      expect: has.string('/blog/2024/Jan/'),
      info: 'BlogMonth uses link when provided',
    },
  ],
  blogYear: [
    {
      fn: BlogYearView(baseState),
      expect: has.string('2024', 'Test Post'),
      info: 'BlogYear renders year and posts',
    },
    {
      fn: BlogYearView({ ...baseState, url: '/blog/', link: '/blog/' }),
      expect: has.string('/blog/2024/'),
      info: 'BlogYear links to year when link provided',
    },
  ],
  blogArchive: [
    {
      fn: div([BlogArchiveView({ blog, url: '/blog/' })]),
      expect: has.string('2024', 'Test Post'),
      info: 'BlogArchive renders all years',
    },
  ],
}
