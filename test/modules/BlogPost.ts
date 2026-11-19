import { has } from '@magic/test'

import { View } from '../../src/modules/BlogPost.mjs'

const state = {
  url: '/blog/archive/2024/01',
  title: 'My Post',
  description: 'My description',
}

export default [
  {
    fn: div([View(state, 'post body')]),
    expect: has.string('My Post', 'My description', 'post body'),
    info: 'BlogPost renders title, description and children',
  },
  {
    fn: div([View(state)]),
    expect: has.string('Blog Archives:'),
    info: 'BlogPost renders blog archives heading',
  },
  {
    fn: div([View(state)]),
    expect: has.string('/blog/archive/2024/', 'year: 2024'),
    info: 'BlogPost links to year archive',
  },
  {
    fn: div([View(state)]),
    expect: has.string('/blog/archive/2024/01/', 'month: 01 2024'),
    info: 'BlogPost links to month archive',
  },
]
