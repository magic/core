import path from 'path'

export const getFileType = name => {
  if (!name || !name.includes('.')) {
    return 'txt'
  }
  return path.extname(name).substring(1)
}
