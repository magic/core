import error from '@magic/error'
import is from '@magic/types'

import { createHash } from './createHash.mjs'
import { replaceSlashSlash } from './replaceSlashSlash.mjs'

/**
 * @param {{ js: { src: string } | { src: string }[], WEB_ROOT: string | undefined }} params
 * @returns {Record<string, string> | undefined}
 */
export const addJsFiles = ({ js = [], WEB_ROOT }) => {
  if (is.empty(js)) {
    return
  }

  if (!is.array(js)) {
    js = [js]
  }

  const hashes = Object.fromEntries(
    js.map(({ src }) => {
      const staticSrc = src.replace(String(WEB_ROOT), '')
      const fileContent = app.static?.[replaceSlashSlash(`/${staticSrc}`)]

      if (!fileContent) {
        throw error(`script ${staticSrc} could not be loaded`, 'E_EXTERNAL_SCRIPT')
      }

      const fileHash = createHash(/** @type {string} */ (fileContent))
      return [staticSrc, fileHash]
    }),
  )

  return hashes
}
