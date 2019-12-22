import path from 'path'

import log from '@magic/log'
import fs from '@magic/fs'

export const getBlog = async () => {
  let files

  try {
    files = await fs.getFiles(config.BLOG_DIR)
  } catch (e) {
    if (config.BLOG_DIR.startsWith(config.ROOT)) {
      log.warn('NOEXIST', `${config.BLOG_DIR} does not exist or does not contain blog posts`)
    }

    throw e
  }

  return files
}
