import is from '@magic/types'

const prepareLink = (url, parent) => {
  if (url.startsWith('/#')) {
    url = url.substr(1)
  }

  if (url.startsWith('/')) {
    if (!url.startsWith(config.WEB_ROOT)) {
      url = `${config.WEB_ROOT}${url.substr(1)}`
    }
  } else if (parent.to) {
    if (url.startsWith('#') || url.startsWith('-')) {
      url = `${parent.to}${url}`
    } else {
      console.log('@magic did not handle this url. Please file a bug at https://github.com/magic/core/issues', url, parent)
    }
  } else {
    console.log('uncaught url', url, parent)
  }

  return url
}

const traverseLinks = (state, parent) => {
  if (state.to && parent) {
    state.to = prepareLink(state.to, parent)

    if (state.items) {
      state.items = state.items.map(item => traverseLinks(item, state))
    }

    return state
  }

  const result = Object.entries(state).map(([key, value]) => {
    if (is.array(value)) {
      value = value.map(val => traverseLinks(val, state))
    } else if (is.objectNative(value)) {
      value = traverseLinks(value)
    }

    return [key, value]
  })

  state = Object.fromEntries(result)

  return state
}

export const prepareStateLinks = app => {
  const { state } = app

  return traverseLinks(state)
}

