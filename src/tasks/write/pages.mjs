import path from 'path'

import fs from '@magic/fs'

export const writePages = async (app, config) => {
  const { DIR, HASHES, WEB_ROOT } = config

  const { pages } = app
  await fs.mkdirp(DIR.PUBLIC)

  const pagePromises = pages.map(async page => {
    const oldHash = HASHES[page.name]
    if (oldHash && oldHash === page.hash) {
      return
    }

    const pagePath = page.path.replace(WEB_ROOT, `${DIR.PUBLIC}/`)

    const dir = path.dirname(pagePath)
    await fs.mkdirp(dir)

    await fs.writeFile(pagePath, page.rendered)
  })

  await Promise.all(pagePromises)
}
