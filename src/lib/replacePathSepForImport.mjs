import path from 'path'

export const replacePathSepForImport = (p, sep = path.sep) => {
  if (sep !== '/') {
    if (sep === '\\') {
      return p.replace(/\\/gi, '/')
    } else {
      return p.replace(new RegExp(sep, 'gi'), '/')
    }
  }
  return p
}
