/**
 * @param {string[]} list
 * @param {string} link
 * @param {string | undefined} root
 * @returns {boolean}
 */
export const isStaticUrl = (list, link, root) => {
  if (link.startsWith(String(root))) {
    link = link.replace(String(root), '/')
  }

  return list.includes(link)
}
