import log from '@magic/log'
import { mock } from '@magic/test'

import { handleLink } from '../../src/lib/handleLink.mjs'

const WEB_ROOT = '/web/root'

/** the spy needs an indexable object, the log interface is not one */
const silentLog = log as unknown as Record<string, unknown>

const withSilentLog = (fn: () => unknown) => {
  const spy = mock.spy(silentLog, 'error', () => {})
  try {
    return fn()
  } finally {
    spy.mockRestore()
  }
}

export default [
  {
    fn: handleLink({ href: 'mailto:test@example.com', WEB_ROOT }),
    expect: 'mailto:test@example.com',
    info: 'handleLink returns mailto links unchanged',
  },
  {
    fn: handleLink({ href: `${WEB_ROOT}/page`, WEB_ROOT }),
    expect: `${WEB_ROOT}/page`,
    info: 'handleLink returns WEB_ROOT links unchanged',
  },
  {
    fn: handleLink({ href: `//${WEB_ROOT}//page//`, WEB_ROOT }),
    expect: `//${WEB_ROOT}/page/`,
    info: 'handleLink replaces double slashes in WEB_ROOT links',
  },
  {
    fn: () => {
      const app: { links: string[] } = { links: [] }
      const result = handleLink({ href: `${WEB_ROOT}/page`, WEB_ROOT, app })
      return app.links.includes(`${WEB_ROOT}/page`) && result === `${WEB_ROOT}/page`
    },
    expect: true,
    info: 'handleLink pushes WEB_ROOT link to app.links',
  },
  {
    fn: handleLink({ href: '/#section', WEB_ROOT }),
    expect: `${WEB_ROOT}/#section`,
    info: 'handleLink adds WEB_ROOT to /# links',
  },
  {
    fn: handleLink({ href: '/page', WEB_ROOT }),
    expect: `${WEB_ROOT}page`,
    info: 'handleLink adds WEB_ROOT to local links',
  },
  {
    fn: handleLink({ href: '#section', WEB_ROOT }),
    expect: `${WEB_ROOT}/#section`,
    info: 'handleLink adds WEB_ROOT to hash links',
  },
  {
    fn: handleLink({ href: '#section', parent: { to: '/parent' }, WEB_ROOT }),
    expect: '/parent/#section',
    info: 'handleLink prepends parent.to to hash links',
  },
  {
    fn: handleLink({ href: '-sub', parent: { to: '/parent' }, WEB_ROOT }),
    expect: '/parent-sub',
    info: 'handleLink appends dash links to parent.to',
  },
  {
    fn: () => withSilentLog(() => handleLink({ href: '-sub', WEB_ROOT })),
    expect: '-sub',
    info: 'handleLink returns dash link unchanged without parent (logs error)',
  },
  {
    fn: () => withSilentLog(() => handleLink({ href: 'ftp://weird/path', WEB_ROOT })),
    expect: 'ftp://weird/path',
    info: 'handleLink returns unknown href unchanged (logs error)',
  },
  {
    fn: handleLink({ href: 'http://example.com//path', WEB_ROOT }),
    expect: 'http://example.com/path',
    info: 'handleLink replaces double slashes in http links',
  },
  {
    fn: handleLink({ href: 'https://example.com/path', WEB_ROOT }),
    expect: 'https://example.com/path',
    info: 'handleLink returns https links unchanged',
  },
  {
    fn: handleLink({ href: '//example.com//path', WEB_ROOT }),
    expect: '//example.com/path',
    info: 'handleLink replaces double slashes in protocol-relative links',
  },
]
