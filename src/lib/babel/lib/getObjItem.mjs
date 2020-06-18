/**
 * Get member expression keys
 *
 * @param {object} path
 * @returns {array}
 */
export const getObjItem = path => {
  let arr = []
  let toCheck

  if (!path) {
    return arr
  }

  // For the identifier likes...
  arr = path.type === 'Identifier' ? [path.name || path.node.name] : arr

  // Lets check other possible keys
  toCheck = path.object || (path.node && path.node.object)
  arr = toCheck ? arr.concat(getObjItem(toCheck)) : arr

  toCheck = path.property || (path.node && path.node.property)
  arr = toCheck ? arr.concat(getObjItem(toCheck)) : arr

  toCheck = path.id || (path.node && path.node.id)
  arr = toCheck ? arr.concat(getObjItem(toCheck)) : arr

  toCheck = path.left || (path.node && path.node.left)
  arr = toCheck ? arr.concat(getObjItem(toCheck)) : arr

  toCheck = path.right || (path.node && path.node.right)
  arr = toCheck ? arr.concat(getObjItem(toCheck)) : arr

  return arr
}
