/**
 * Check if patterns match
 *
 * @param {array} data
 * @param {string} pattern
 * @returns {boolean}
 */
export const matches = (data, pattern) => {
  if (!pattern || !pattern.length || !data || !data.length) {
    return false
  }

  const filter = data.filter(val => {
    const newPattern = val.replace(/\./g, '.')
    const reg = new RegExp(newPattern, 'g')
    const is = reg.test(pattern)

    return is
  })

  return !!filter[0]
}
