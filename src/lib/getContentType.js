const getFileType = require('./getFileType')
const contentTypes = require('./contentTypes')

const getContentType = uri => {
  const fileType = getFileType(uri)
  let contentType = 'text/plain'
  if (contentTypes[fileType]) {
    contentType = contentTypes[fileType]
  }

  return contentType
}

module.exports = getContentType
