import is from '@magic/types'

export const handleStyleFunctions = s => {
  if (is.function(s)) {
    const variables = config.THEME_VARS || {}
    return s(variables)
  }

  return s
}
