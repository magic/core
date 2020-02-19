export const replacePathSepForImport = (p, sep) => {
  if (sep !== '/') {
    if (sep === '\\') {
      return p.replace(/\\/gi, '/')
    } else {
      return p.replace(new RegExp(sep, 'gi'), '/')
    }
  }
  return p
}
