import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'

/**
 * @param {{ BLOG_DIR?: string, ROOT?: string }} params
 * @returns {Promise<string[] | undefined>}
 */
export const getBlog = async ({ BLOG_DIR, ROOT }) => {
  let files

  if (!BLOG_DIR) {
    return undefined
  }

  try {
    files = await fs.getFiles(BLOG_DIR)
  } catch (e) {
    if (BLOG_DIR.startsWith(ROOT ?? '')) {
      log.warn('NOEXIST', `${BLOG_DIR} does not exist or does not contain blog posts`)
    }

    throw error(/** @type {Error} */ (e))
  }

  return files
}
