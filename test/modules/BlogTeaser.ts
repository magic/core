import { is, has } from '@magic/test'

import { View } from '../../src/modules/BlogTeaser.mjs'

const state = {
  day: '01',
  month: 'Jan',
  year: '2024',
  name: '/blog/test-post',
  title: 'Test Post',
  description: 'A test post description',
}

export default [
  {
    fn: View(state),
    expect: is.string,
    info: 'BlogTeaser View renders to a string',
  },
  {
    fn: View(state),
    expect: has.string('01', 'Jan', '2024', 'Test Post'),
    info: 'BlogTeaser View contains date and title',
  },
  {
    fn: View(state),
    expect: has.string('A test post description'),
    info: 'BlogTeaser View contains description',
  },
  {
    fn: View(state),
    expect: has.string('/blog/test-post'),
    info: 'BlogTeaser View links to post name',
  },
]
