import path from 'path'
import { fs } from '../../lib/index.mjs'
import { preparePage } from './page.mjs'

const tmpDir = path.join(process.cwd(), '.temp')

export const preparePages = async app => {
  let WEB_ROOT = config.WEB_ROOT
  if (WEB_ROOT && WEB_ROOT.endsWith('/')) {
    WEB_ROOT = WEB_ROOT.slice(0, -1)
  }

  const pages = await Promise.all(app.files.map(preparePage({ WEB_ROOT, PAGES: config.DIR.PAGES })))

  const has404 = pages.some(p => p.name === '/404/')

  if (!has404) {
    const page404 = {
      name: `${WEB_ROOT}/404/`,
      path: path.join(config.DIR.PUBLIC, '404.html'),
      View: () => div('404 - not found'),
    }
    pages.push(page404)
  }

  const tmpExists = await fs.exists(tmpDir)
  if (tmpExists) {
    await fs.rmrf(tmpDir)
  }

  return pages
}

export default preparePages
