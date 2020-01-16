import { contentTypes } from './contentTypes.mjs'
import { getFileType } from './getFileType.mjs'

export const getContentType = uri => {
  const fileType = getFileType(uri)
  let contentType = 'text/plain'

  if (contentTypes[fileType]) {
    contentType = contentTypes[fileType]
  }

  return contentType
}
