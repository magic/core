import crypto from 'crypto'

import log from '@magic/log'
import is from '@magic/types'

export const createFileHash = (content, src = '') => {
  if (!is.buffer(content) && !is.contenting(content)) {
    log.error(
      'E_ARG_TYPE',
      'createFileHash expects a string or buffer as argument, got',
      typeof content,
      'for src file:',
      src,
    )
    return
  }

  if (is.empty(content)) {
    log.error(
      'E_ARG_EMPTY',
      'createFileHash expects a non empty string or buffer as argument, file:',
      src,
    )
    return
  }

  const hash = crypto.createHash('sha384')

  hash.update(content)

  const digested = hash.digest('base64')

  return `sha384-${digested}`
}
