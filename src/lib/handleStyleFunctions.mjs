import is from '@magic/types'

/**
 * @param {unknown} s
 * @param {{ THEME_VARS?: { [key: string]: unknown } }} [config]
 * @returns {unknown}
 */
export const handleStyleFunctions = (s, config) => {
  if (is.function(s)) {
    const variables = (config && config.THEME_VARS) || {}
    return s(variables)
  }

  return s
}
