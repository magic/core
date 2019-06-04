import path from 'path'

import { fs } from './fs.mjs'

export const rmrf = async dir => {
  if (!dir) {
    throw new Error('rmrf: expecting a string argument.')
  }

  if (!dir.startsWith(process.cwd())) {
    throw new Error('rmrf will not work outside the cwd.')
  }

  try {
    await fs.stat(dir)
  } catch (e) {
    if (e.code === 'ENOENT') {
      return
    }
    throw e
  }

  const stat = await fs.stat(dir)
  if (stat.isFile()) {
    await fs.unlink(dir)
  } else if (stat.isDirectory()) {
    const files = await fs.readdir(dir)
    await Promise.all(files.map(async file => await rmrf(path.join(dir, file))))

    await fs.rmdir(dir)
  }
}
