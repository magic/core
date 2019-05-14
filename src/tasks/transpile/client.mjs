import path from 'path'

import log from '@magic/log'
import browserify from 'browserify'

import { runBabel, fs } from '../../lib/index.mjs'

export default async ({ str }) => {
  const filePath = path.join(process.cwd(), '.__browserify_empty.js')
  fs.writeFileSync(filePath, str)

  const babel = runBabel(config)

  try {
    return new Promise((res, rej) =>
      browserify(filePath)
        .transform('babelify', { ...babel.opts })
        .bundle((err, src) => {
          if (!config.KEEP_CLIENT && !process.argv.includes('--keep-client')) {
            fs.unlinkSync(filePath)
          }
          if (err) {
            rej(err)
          } else {
            res(src.toString())
          }
        }),
    )
  } catch (e) {
    log.error(e, `error in page ${filePath}`)
  }
}
