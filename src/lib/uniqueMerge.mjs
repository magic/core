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
      a[key].forEach(name => {
        if (b.hasOwnProperty(key) && !b[key].includes(name)) {
          b[key].push(name)
        }
      })

      if (b[key]) {
        b[key] = b[key].sort()
      }
    })

  return b
}
