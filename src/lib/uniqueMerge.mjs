/**
 * @param {{ [key: string]: unknown } | null | undefined} a
 * @param {{ [key: string]: unknown } | null | undefined} b
 * @returns {{ [key: string]: unknown } | null | undefined}
 */
export const uniqueMerge = (a, b) => {
  if (!a) {
    return b
  } else if (!b) {
    return a
  }

  /* make sure we loop over the smaller object */
  if (Object.keys(a).length > Object.keys(b).length) {
    const aTmp = a
    a = b
    b = aTmp
  }

  Object.keys(a)
    .filter(a => a)
    .forEach(key => {
      const aValues = /** @type {string[]} */ (a[key])
      const bValues = /** @type {string[] | undefined} */ (b[key])

      aValues.forEach(name => {
        if (bValues && !bValues.includes(name)) {
          bValues.push(name)
        }
      })

      if (bValues) {
        b[key] = bValues.sort()
      }
    })

  return b
}
