import crypto from 'crypto'

import is from '@magic/types'
import error from '@magic/error'

export const createHash = content => {
  if (!is.buffer(content) && !is.string(content)) {
    throw error(`createHash(content) expects a string or buffer, got ${typeof content}`, 'ARG_TYPE')
  }

  if (is.empty(content)) {
    throw error('createHash(content) expects a non empty string or buffer', 'ARG_EMPTY')
  }

  const hash = crypto.createHash('sha384')

  hash.update(content)

  const digested = hash.digest('base64')

  return `sha384-${digested}`
}
