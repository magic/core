import path from 'path'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'

export const getBlog = async ({ BLOG_DIR, ROOT }) => {
  let files

  try {
    files = await fs.getFiles(BLOG_DIR)
  } catch (e) {
    if (BLOG_DIR.startsWith(ROOT)) {
      log.warn('NOEXIST', `${BLOG_DIR} does not exist or does not contain blog posts`)
    }

    throw error(e)
  }

  return files
}
