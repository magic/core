import path from 'path'

import { fs } from './fs.mjs'

export const mkdirp = async p => {
  if (!p) {
    throw new Error('mkdirp needs an argument')
  }

  p = path.resolve(p)

  try {
    const dir = path.dirname(p)
    const exists = await fs.exists(dir)
    if (!exists) {
      await mkdirp(dir)
    }
    await fs.mkdir(p)
    return true
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
}
