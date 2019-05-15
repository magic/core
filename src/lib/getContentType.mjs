import { getFileType } from './getFileType.mjs'
import { contentTypes } from './contentTypes.mjs'

export const getContentType = uri => {
  const fileType = getFileType(uri)
  let contentType = 'text/plain'
  if (contentTypes[fileType]) {
    contentType = contentTypes[fileType]
  }

  return contentType
}
