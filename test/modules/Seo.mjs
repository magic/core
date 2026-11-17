import { has } from '@magic/test'

import { View } from '../../src/modules/Seo.mjs'

const baseState = {
  title: 'Page Title',
  description: 'Page description',
  keywords: ['a', 'b'],
  root: '/root/',
}

export default [
  {
    fn: div([View({ ...baseState })]),
    expect: has.string('Page Title'),
    info: 'Seo renders title',
  },
  {
    fn: div([View({ ...baseState })]),
    expect: has.string('Page description'),
    info: 'Seo renders description meta',
  },
  {
    fn: div([View({ ...baseState, keywords: ['a', 'b'] })]),
    expect: has.string('a b'),
    info: 'Seo joins array keywords with spaces',
  },
  {
    fn: div([View({ ...baseState, description: ['d1', 'd2'] })]),
    expect: has.string('d1 d2'),
    info: 'Seo joins array description with spaces',
  },
  {
    fn: div([View({ ...baseState, favicon: '/my-icon.png' })]),
    expect: has.string('/my-icon.png'),
    info: 'Seo uses custom favicon',
  },
  {
    fn: div([View({ ...baseState })]),
    expect: has.string('/root/favicon.ico'),
    info: 'Seo falls back to root favicon.ico',
  },
  {
    fn: div([View({ ...baseState, image: '/img//photo.png' })]),
    expect: has.string('/img/photo.png'),
    info: 'Seo renders og:image meta with slash-slashed image',
  },
  {
    fn: div([View({ ...baseState, seo: { name: 'Seo Name', author: { name: 'Author Name' } } })]),
    expect: has.string('Seo Name', 'Author Name'),
    info: 'Seo uses seo.name as title and author.name',
  },
  {
    fn: div([
      View({
        ...baseState,
        seo: { author: { givenName: 'First', additionalName: 'Middle', lastName: 'Last' } },
      }),
    ]),
    expect: has.string('First Middle Last'),
    info: 'Seo builds author name from parts',
  },
  {
    fn: div([View({ ...baseState, seo: { name: 'Graph', type: 'article' } })]),
    expect: has.string('application/ld+json'),
    info: 'Seo renders json-ld script',
  },
  {
    fn: div([
      View({
        ...baseState,
        seo: {
          custom: [{ type: 'application/ld+json', innerHTML: '{"custom": true}' }],
        },
      }),
    ]),
    expect: has.string('custom'),
    info: 'Seo renders custom scripts',
  },
]
