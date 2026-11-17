import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'
import is from '@magic/types'

import { isLocalPath } from '../../lib/index.mjs'

/**
 * @param {string | undefined} dir
 * @returns {Promise<void>}
 */
export const clean = async dir => {
  if (is.string(dir) && !is.empty(dir)) {
    if (!isLocalPath(path.resolve(dir))) {
      // do not delete above/outside the cwd
      const msg = `TRIED DELETING OUTSIDE OF CWD!
      directory: ${dir} is not within ${process.cwd()}
      This is not good, please file an issue on https://github.com/magic/core/issues/ or send me a mail: bug@jaeh.at`
      throw error(msg, 'E_DEL_OUTSIDE_CWD')
    }

    log.warn('remove', dir)
    await fs.rmrf(dir)
  }
}

export default clean
