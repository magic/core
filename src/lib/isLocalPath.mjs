import path from 'path'

/**
 * @param {string} p
 * @returns {boolean}
 */
export const isLocalPath = p => {
  const cwd = process.cwd()
  return p.startsWith(cwd + path.sep)
}
