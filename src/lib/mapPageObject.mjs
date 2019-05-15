import is from '@magic/types'

export const mapPageObject = (o, key, c) => ([k, v]) => {
  const isGlobal = c.global && c.global[key] && Object.keys(c.global[key]).includes(k)

  if (!isGlobal) {
    if (!is.defined(o[key])) {
      o[key] = {
        [k]: v,
      }
    } else if (is.undefined(o[key][k])) {
      o[key][k] = v
    }
  }
  return o
}
