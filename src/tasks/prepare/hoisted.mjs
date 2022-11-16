import is from '@magic/types'

export const prepareHoisted = HOIST => {
  let hoisted = ''

  if (!is.empty(HOIST)) {
    if (is.array(HOIST)) {
      hoisted = HOIST.map(component => `${component}(state)`).join(',')
      if (HOIST.length > 1) {
        hoisted = `[${hoisted}]`
      } else if (HOIST.length === 0) {
        hoisted = ''
      }
    } else if (is.string(HOIST)) {
      hoisted = HOIST
      if (!hoisted.includes('state')) {
        hoisted = `${hoisted}(state)`
      }
    }

  }

  return hoisted
}