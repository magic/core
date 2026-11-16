import is from '@magic/types'

/**
 * @param {unknown} module
 * @returns {string | undefined}
 */
export const moduleViewToString = module => {
  if (is.function(module)) {
    return module.toString()
  } else if (is.function(/** @type {{ View?: unknown }} */ (module)?.View)) {
    return /** @type {{ View: { toString(): string } }} */ (module).View.toString()
  }
}
