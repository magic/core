import path from 'path'

import fs from '@magic/fs'

const watchChangeListener = dir => (evt, file) => {
  const filePath = path.join(dir, file)
  console.log({ evt, file })
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
