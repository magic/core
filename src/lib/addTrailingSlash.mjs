/**
 * @param {string} str
 * @returns {string}
 */
/**
 * @param {string | undefined} str
 * @returns {string}
 */
export const addTrailingSlash = str => {
  const s = String(str)
  return s.endsWith('/') ? s : `${s}/`
}
