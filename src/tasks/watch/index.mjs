import path from 'path'

import is from '@magic/types'
import fs from '@magic/fs'

const watchChangeListener = dir => (evt, file) => {
  if (!is.string(file)) {
    file = ''
  }

  const filePath = path.join(dir, file)
  if (!is.str(evt)) {
    evt = 'change'
  }

  process.send({ evt, file: filePath })
}

export const watch = files => {
  files.map(async file => {
    const watchListener = watchChangeListener(file)
    const stat = await fs.stat(file)

    if (stat.isFile()) {
      fs.watchFile(file, watchListener)
    } else if (stat.isDirectory()) {
      fs.watch(file, watchListener)
    }
  })
}

export default watch
