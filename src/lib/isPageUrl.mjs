/**
 * @param {{ name?: string }[]} list
 * @param {string} link
 * @returns {boolean}
 */
export const isPageUrl = (list, link) => list.some(({ name }) => name === link)
