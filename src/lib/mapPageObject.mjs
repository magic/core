import is from '@magic/types'

/**
 * @param {Record<string, unknown>} o
 * @param {string} key
 * @param {{ global?: Record<string, Record<string, unknown>> }} c
 * @returns {(entry: [string, unknown]) => Record<string, unknown>}
 */
export const mapPageObject =
  (o, key, c) =>
  ([k, v]) => {
    const globalEntry = c.global && c.global[key]
    const isGlobal = !!globalEntry && Object.keys(globalEntry).includes(k)

    if (!isGlobal) {
      if (!is.defined(o[key])) {
        o[key] = {
          [k]: v,
        }
      } else {
        const sub = /** @type {Record<string, unknown>} */ (o[key])
        if (is.undefined(sub[k])) {
          sub[k] = v
        }
      }
    }

    return o
  }
