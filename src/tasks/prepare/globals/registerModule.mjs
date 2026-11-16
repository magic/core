import is from '@magic/types'

/**
 * @param {[string, unknown]} entry
 */
export const registerModule = ([name, mod]) => {
  const globalRecord = /** @type {Record<string, Record<string, unknown>>} */ (
    /** @type {unknown} */ (global)
  )

  /**
   * @param {unknown} value
   * @returns {Record<string, unknown>}
   */
  const asRecord = value => /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (value))

  if (is.fn(mod)) {
    globalRecord[name] = asRecord(mod)
  } else if (is.fn(/** @type {{ View?: unknown }} */ (mod)?.View)) {
    globalRecord[name] = asRecord(/** @type {{ View: unknown }} */ (mod).View)
  } else if (is.fn(/** @type {Record<string, unknown>} */ (mod)?.[name])) {
    globalRecord[name] = asRecord(/** @type {Record<string, unknown>} */ (mod)[name])
  }

  const modEntries = Object.entries(asRecord(mod))
  const views = modEntries.filter(([k]) => k !== name && is.case.upper(k[0]) && k !== 'View')

  views.forEach(([k, v]) => {
    if (is.function(v)) {
      globalRecord[name][k] = asRecord(v)
    } else if (is.objectNative(v) && v.View) {
      globalRecord[name][k] = v
    }
  })
}
