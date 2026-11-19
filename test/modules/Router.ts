import { has } from '@magic/test'

import { View, Link, actions } from '../../src/modules/Router.mjs'

const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'

/** structural view of the vnode Link returns, as used by these tests */
type LinkVNode = {
  props: {
    onclick: (state: Record<string, unknown>, e: Record<string, unknown>) => Record<string, unknown>
  }
}

export default {
  view: [
    {
      fn: View({ page: () => 'page-content', state: { pageClass: {} } }),
      expect: has.string('Magic', 'Page', 'page-content'),
      info: 'Router View renders page wrapper with content',
    },
    {
      fn: View({ page: () => 'page-content', state: { pageClass: {} } }, 'after-content'),
      expect: has.string('after-content'),
      info: 'Router View renders children after page',
    },
  ],
  link: [
    {
      fn: Link({ to: '/local' }),
      expect: has.string('/local'),
      info: 'Router Link renders local href',
    },
    {
      fn: Link({ href: '/from-href' }),
      expect: has.string('/from-href'),
      info: 'Router Link falls back to href prop',
    },
    {
      fn: Link({ to: 'https://example.com/ext' }),
      expect: has.string('https://example.com/ext', '_blank', 'noopener'),
      info: 'Router Link opens external links in new tab',
    },
    {
      fn: Link({ to: 'https://example.com/ext', nofollow: true }),
      expect: has.string('noopener', 'nofollow'),
      info: 'Router Link adds nofollow rel',
    },
    {
      fn: Link({ to: 'https://example.com/ext', noreferrer: true }),
      expect: has.string('noreferrer'),
      info: 'Router Link adds noreferrer rel',
    },
    {
      fn: Link({ to: '/local', text: 'custom text' }),
      expect: has.string('custom text'),
      info: 'Router Link uses explicit text',
    },
    {
      fn: Link({ to: '/local', text: 'a' }, 'extra'),
      expect: has.string('a'),
      info: 'Router Link combines text and children',
    },
    {
      fn: Link({ to: '/local' }),
      expect: has.string('/local'),
      info: 'Router Link falls back to to as text',
    },
    {
      fn: () => {
        const vnode = Link({ to: '/about' }) as LinkVNode
        return typeof vnode.props.onclick === 'function'
      },
      expect: true,
      info: 'Router Link local links use a plain onclick handler',
    },
    {
      fn: () => {
        const vnode = Link({ to: '/about' }) as LinkVNode
        const event = {
          defaultPrevented: false,
          currentTarget: { href: `${origin}/about` },
          preventDefault() {
            this.defaultPrevented = true
          },
        }
        const state = vnode.props.onclick(
          { url: '/current', hash: '', pages: { '/about': { title: 'About' } } },
          event,
        )
        return (
          event.defaultPrevented === true && state.url === '/about' && state.prev === '/current'
        )
      },
      expect: true,
      info: 'Router Link onclick preventDefaults the event and navigates via actions.go',
    },
    {
      fn: () => {
        const customAction = (
          state: Record<string, unknown>,
          e: { currentTarget?: { href: string } } | null | undefined,
        ) => ({ ...state, custom: e?.currentTarget?.href ?? '' })
        const vnode = Link({ to: '/about', action: customAction }) as LinkVNode
        const event = {
          defaultPrevented: false,
          currentTarget: { href: `${origin}/about` },
          preventDefault() {
            this.defaultPrevented = true
          },
        }
        const state = vnode.props.onclick({ url: '/current', hash: '' }, event)
        return event.defaultPrevented === true && state.custom === `${origin}/about`
      },
      expect: true,
      info: 'Router Link custom action receives the real event after preventDefault',
    },
  ],
  actions: {
    go: [
      {
        fn: () => actions.go({ url: '/current', hash: '' }, null),
        expect: (s: Record<string, unknown>) => s.url === '/current',
        info: 'go without event does nothing',
      },
      {
        fn: () =>
          actions.go(
            { url: '/current', hash: '', pages: { '/about': { title: 'About' } } },
            { currentTarget: { href: `${origin}/about` } },
          ),
        expect: (s: Record<string, unknown>) => s.url === '/about' && s.prev === '/current',
        info: 'go navigates to a new local page',
      },
      {
        fn: () =>
          actions.go(
            { url: '/current', hash: 'h1' },
            {
              currentTarget: { href: `${origin}/current#h1` },
            },
          ),
        expect: (s: Record<string, unknown>) => s.url === '/current' && s.hash === 'h1',
        info: 'go to same url and hash keeps state',
      },
    ],
    pop: [
      {
        fn: () => {
          const s = actions.pop({ url: '/x', hash: '' }, null)
          return typeof s.url === 'string' && typeof s.hash === 'string'
        },
        expect: true,
        info: 'pop reads window location and returns url/hash',
      },
      {
        fn: () => {
          const s = actions.pop(
            { url: '/x', hash: '' },
            { state: { url: '/e', hash: 'eh', scrollY: 5 } },
          )
          return s.url === '/e' && s.hash === 'eh'
        },
        expect: true,
        info: 'pop uses event state when provided',
      },
    ],
  },
}
