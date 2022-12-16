import path from 'path'

import fs from '@magic/fs'

import { writeFile } from '../../lib/index.mjs'

const handleImage = file => {
  // check if file is image
  // if is image, check if alternative formats (webp, avif) exist in docs
  // if not in docs, check if they are in src/assets/static
  // if in src/assets/static, just copy
  // if not in src/assets/static
  //   convert using sharp.
  console.log({ file })
}

export const writeStatic = async (app, config) => {
  const { DIR, IGNORED_STATIC } = config

  const { static: stat } = app
  await fs.mkdirp(DIR.PUBLIC)

  // write static first to make sure all other files below get written
  // even if there is a name clash
  await Promise.all(
    Object.entries(stat)
      // .filter(([name]) => !images.includes(getFileType(name)))
      .map(async file => {
        const [name] = file

        handleImage(file)

        const extname = path.extname(name)
        // do not write file if extension or filepath is in ignore list.
        if (IGNORED_STATIC.includes(extname) || IGNORED_STATIC.includes(name)) {
          return
        }

        const dir = path.join(DIR.PUBLIC, path.dirname(name))
        await fs.mkdirp(dir)
        await writeFile(file, config)
      }),
  )
}
