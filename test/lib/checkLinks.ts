import log from '@magic/log'
import { mock } from '@magic/test'

import { checkLinks } from '../../src/lib/checkLinks.mjs'

const root = '/'
const pages = [
  { name: '/page1', rendered: '<div id="section1"></div>' },
  { name: '/page2', rendered: '' },
]
const staticUrls = ['/img.png', '/style.css']

const silent = async fn => {
  const spy = mock.spy(log, 'error', () => {})
  const warn = mock.spy(log, 'warn', () => {})
  try {
    return await fn()
  } finally {
    spy.mockRestore()
    warn.mockRestore()
  }
}

const base = { staticUrls, pages, noRemote: true, root }

export default [
  {
    fn: () => silent(async () => checkLinks({ ...base, links: ['/page1'] })),
    expect: [],
    info: 'checkLinks resolves a local page url',
  },
  {
    fn: () => silent(async () => checkLinks({ ...base, links: ['/page1#section1'] })),
    expect: [],
    info: 'checkLinks resolves a local hashed url',
  },
  {
    fn: () => silent(async () => checkLinks({ ...base, links: ['/img.png'] })),
    expect: [],
    info: 'checkLinks resolves a local static url',
  },
  {
    fn: () => silent(async () => checkLinks({ ...base, links: ['mailto:test@example.com'] })),
    expect: [],
    info: 'checkLinks ignores mailto links',
  },
  {
    fn: () => silent(async () => checkLinks({ ...base, links: ['https://example.com/page'] })),
    expect: [],
    info: 'checkLinks skips remote links when noRemote',
  },
  {
    fn: () => silent(async () => checkLinks({ ...base, links: ['/missing-page'] })),
    expect: ['/missing-page'],
    info: 'checkLinks returns unresolved local link',
  },
  {
    fn: () =>
      silent(async () =>
        checkLinks({
          staticUrls,
          pages,
          noRemote: false,
          root,
          links: ['https://example.com/ignored'],
          ignoredLinks: ['https://example.com/ignored'],
        }),
      ),
    expect: [],
    info: 'checkLinks skips ignored remote links',
  },
]
