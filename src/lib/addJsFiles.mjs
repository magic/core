import is from '@magic/types'
import error from '@magic/error'

import { createHash } from './createHash.mjs'
import { replaceSlashSlash } from './replaceSlashSlash.mjs'

export const addJsFiles = ({ js = [], WEB_ROOT }) => {
  if (is.empty(js)) {
    return
  }

  if (!is.array(js)) {
    js = [js]
  }

  const hashes = {}

  js.forEach(({ src }) => {
    const staticSrc = src.replace(WEB_ROOT, '')
    const fileContent = app.static[replaceSlashSlash(`/${staticSrc}`)]

    if (!fileContent) {
      throw error(`script ${staticSrc} could not be loaded`, 'E_EXTERNAL_SCRIPT')
    }

    const fileHash = createHash(fileContent)
    hashes[staticSrc] = fileHash
  })

  return hashes
}
