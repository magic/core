import is from '@magic/types'
import log from '@magic/log'

const prepareLink = (url, parent, app) => {
  if (url.startsWith('/#')) {
    url = url.substr(1)
  }

  if (url.startsWith('/')) {
    if (!url.startsWith(config.WEB_ROOT)) {
      url = `${config.WEB_ROOT}${url.substr(1)}`
    }
  } else if (url.startsWith('#') || url.startsWith('-')) {
    if (parent.to) {
      url = `${parent.to}${url}`
    } else {
      url = `${config.WEB_ROOT}${url}`
    }
  } else {
    log.error(
      '@magic did not handle this url. Please file a bug at https://github.com/magic/core/issues',
      url,
      parent,
    )
  }

  app.links.push(url)

  return url
}

const traverseLinks = ({ state, parent, app }) => {
  if (state.to && parent) {
    state.to = prepareLink(state.to, parent, app)

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

export const prepareStateLinks = app => traverseLinks({ state: app.state, app })
