import path from 'path'

/**
 * @param {string} p
 * @param {string} [sep]
 * @returns {string}
 */
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
