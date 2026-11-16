/**
 * @param {string} str
 * @param {string} [replaceWith]
 * @returns {string}
 */
export const replaceSlashSlash = (str, replaceWith = '/') => str.replace(/\/\/+/g, replaceWith)
