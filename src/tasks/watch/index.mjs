import { fs } from '../../lib/index.mjs'
import path from 'path'

import { getDirectories } from '../../lib/index.mjs'

const watch = async dir => {
  const dirs = await getDirectories(dir)

  dirs.map(dir => {
    fs.watch(dir, (evt, file) => {
      const filePath = path.join(dir, file)
      process.send({ evt, file: filePath })
    })
  })
}

export default watch
