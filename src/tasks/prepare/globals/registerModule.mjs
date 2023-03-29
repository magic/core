import is from '@magic/types'

export const registerModule = ([name, mod]) => {
  if (is.fn(mod)) {
    global[name] = mod
  } else if (is.fn(mod.View)) {
    global[name] = mod.View
  } else if (is.fn(mod[name])) {
    global[name] = mod[name]
  }

  const views = Object.entries(mod).filter(
    ([k]) => k !== name && is.case.upper(k[0]) && k !== 'View',
  )

  views.forEach(([k, v]) => {
    if (is.function(v)) {
      global[name][k] = v
    } else if (v.View) {
      global[name][k] = v.View
    }
  })
}
