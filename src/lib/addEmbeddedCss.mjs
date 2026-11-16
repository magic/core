import is from '@magic/types'
import error from '@magic/error'

/**
 * @param {string} file
 * @returns {string}
 */
export const addEmbeddedCss = file => {
  const contents = app.static?.[file]
  const content = /** @type {string | { toString: () => string }} */ (contents)

  if (is.empty(content) || !is.fn(content.toString)) {
    throw error(`Empty css file: ${file}`, 'E_PREPEND_CSS_EMPTY')
  }

  return content.toString()
}
