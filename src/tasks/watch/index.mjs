import path from 'path'

import fs from '@magic/fs'

export const watch = async dir => {
  const dirs = await fs.getDirectories(dir)

  dirs.map(dir => {
    fs.watch(dir, (evt, file) => {
      const filePath = path.join(dir, file)
      process.send({ evt, file: filePath })
    })
  })
}

export default watch
