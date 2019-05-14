import path from 'path'

import fs from './fs.mjs'

export const writeFile = async ([name, content]) =>
  await fs.writeFile(path.join(config.DIR.PUBLIC, name), content)

export default writeFile
