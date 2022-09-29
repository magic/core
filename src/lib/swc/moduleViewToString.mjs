import is from '@magic/types'

export const moduleViewToString = module => {
  if (is.function(module)) {
    return module.toString()
  } else if (is.function(module?.View)) {
    return module.View.toString()
  }
}
