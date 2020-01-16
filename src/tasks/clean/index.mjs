import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import is from '@magic/types'
import log from '@magic/log'

import { isLocalPath } from '../../lib/index.mjs'

export const clean = async config => {
  const dir = config.DIR.PUBLIC

  if (is.string(dir) && !is.empty(dir)) {
    if (!isLocalPath(path.resolve(dir))) {
      // do not delete above/outside the cwd
      const msg = `TRIED DELETING OUTSIDE OF CWD!
      directory: ${dir} is not within ${process.cwd()}
      This is not good, please file an issue on https://github.com/magic/core or send me a mail: bug@jaeh.at`
      throw error(msg, 'E_DEL_OUTSIDE_CWD')
    }

    log.warn('remove', dir)
    await fs.rmrf(dir)
  }
}

export default clean
