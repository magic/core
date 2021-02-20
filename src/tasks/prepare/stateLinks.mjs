import is from '@magic/types'

import { handleLink } from '../../lib/index.mjs'

const traverseLinks = ({ state, parent, app }) => {
  if (state.to && parent) {
    state.to = handleLink({ href: state.to, parent, app })

    if (state.items) {
      state.items = state.items.map(item => traverseLinks({ state: item, parent: state, app }))
    }

    return state
  }

  const result = Object.entries(state).map(([key, value]) => {
    if (is.array(value)) {
      value = value.map(val => {
        if (is.string(val)) {
          return val
        }

        const traversed = traverseLinks({ state: val, parent: state, app })
        return traversed
      })
    } else if (is.objectNative(value)) {
      value = traverseLinks({ state: value, app })
    }

    return [key, value]
  })

  return Object.fromEntries(result)
}

export const prepareStateLinks = app => {
  const { logo, seo } = app.state
  if (!is.empty(logo) && is.string(logo)) {
    app.state.logo = handleLink({ href: logo, app })
  }

  if (!is.empty(seo?.image) && is.string(seo?.image)) {
    app.state.seo.image = handleLink({ href: seo.image, app })
  }

  return traverseLinks({ state: app.state, app })
}
