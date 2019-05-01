const is = require('@magic/types')

const handleStyleFunctions = s => {
  if (is.function(s)) {
    const variables = config.THEME_VARS || {}
    return s(variables)
  }

  return s
}

module.exports = handleStyleFunctions
