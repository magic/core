import { preparePage } from './page.mjs'

import { replaceSlashSlash } from '../../lib/index.mjs'

export const preparePages = async (app, config) => {
  const { WEB_ROOT, DIR } = config

  const pageWorker = preparePage({ WEB_ROOT, pageDir: DIR.PAGES, state: app.state, config })

  let pages = await Promise.all(app.files.map(pageWorker))

  if (app.pages) {
    pages = [...app.pages, ...pages]
  }

  const has404 = pages.some(p => p && p.name === replaceSlashSlash(`${WEB_ROOT}/404/`))

  if (!has404) {
    const page404 = {
      name: replaceSlashSlash(`${WEB_ROOT}/404/`),
      path: replaceSlashSlash(`${WEB_ROOT}/404.html`),
      View: () => div('404 - not found.'),
      state: {
        title: '404 - not found',
        description: '404 - not found.',
      },
      originalState: {
        title: '404 - not found',
        description: '404 - not found.',
      },
    }

    pages.push(page404)
  }

  return pages.filter(a => a)
}

export default preparePages
