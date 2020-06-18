/**
 * Get property
 *
 * @param {object} opts
 * @param {object} path
 * @param {array} properties
 * @returns {array}
 */
export const getArrItem = (opts, path, properties) => {
  const rightProperties = []

  // Go through each property
  properties.forEach(property => {
    let toCheck

    toCheck = property.type === 'Identifier' && property
    toCheck = toCheck || (property.node.value && property.get('value'))
    toCheck = toCheck || (property.node.local && property.get('local'))
    toCheck = toCheck || (property.node.id && property.get('id'))
    toCheck = toCheck && toCheck.node && toCheck.node.name

    if (matches(opts, toCheck)) {
      // It was found!
      rightProperties.push(properties.length > 1 ? property : path)
    }
  })

  return rightProperties
}
