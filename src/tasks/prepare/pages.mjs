import { preparePage } from './page.mjs'

export const preparePages = async app => {
  let WEB_ROOT = config.WEB_ROOT
  if (WEB_ROOT && WEB_ROOT.endsWith('/')) {
    WEB_ROOT = WEB_ROOT.slice(0, -1)
  }

  let pages = await Promise.all(
    app.files.map(preparePage({ WEB_ROOT, PAGES: config.DIR.PAGES, state: app.state })),
  )

  if (app.pages) {
    pages = [...app.pages, ...pages]
  }

  const has404 = pages.some(p => p && p.name === `${config.WEB_ROOT}404/`)

  if (!has404) {
    const page404 = {
      name: `${config.WEB_ROOT}404/`,
      path: `${config.WEB_ROOT}/404.html`,
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
