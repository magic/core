export const View = ({ page, state }) => {
  page = page ? page(state) : '404 - not found'

  const props = {
    class: `Page`,
  }
  if (state.class) {
    props.class += ` ${state.class}`
  }

  return div(
    {
      class: 'Wrapper',
    },
    [Header(state), div(props, page), Footer(state)],
  )
}

export const Link = ({ to, ...p }, children) => {
  const { href, text, nofollow, noreferrer, onclick = false, ...props } = p
  to = to || href || ''
  props.href = to

  const isLocal = to.startsWith('/')
  if (isLocal) {
    props.onclick = [actions.go, helpers.mapClickToGo]
  } else {
    props.target = '_blank'
    props.rel = 'noopener'
    if (nofollow) {
      props.rel += ' nofollow'
    }
    if (noreferrer) {
      props.rel += ' noreferrer'
    }
  }

  return a(props, [text, children])
}

export const actions = {
  // page: {
  //   addClass: (state, cl) => {
  //     if (state.class.includes(cl)) {
  //       return state
  //     }

  //     return {
  //       ...state,
  //       class: `${state.class} ${cl}`,
  //     }
  //   },

  //   removeClass: (state, cl) => {
  //     if (!state.class.includes(cl)) {
  //       return state
  //     }

  //     cl = state.class
  //       .replace(cl, '')
  //       .replace(/\s\s+/g, ' ')

  //     return {
  //       ...state,
  //       class: cl,
  //     }
  //   },

  //   toggleClass: (state, cl) => {
  //     if (state.class.includes(cl)) {
  //       return addPageClass(state, cl)
  //     } else {
  //       return removePageClass(state, cl)
  //     }
  //   },
  // },

  pop: (state, e) => {
    let { pathname: url, hash } = window.location
    hash = hash.substring(1)

    if (e.state) {
      url = e.state.url
      hash = e.state.hash
    }

    if (hash) {
      window.location.hash = hash
    } else {
      window.scrollTo(0, 0)
    }

    return {
      ...state,
      url,
      hash,
    }
  },

  go: (state, e) => {
    // make sure our to never includes the origin
    // this makes sure we can distinguish between local and external links below
    let to = e.currentTarget.href.replace(window.location.origin, '')

    const [url, hash = ''] = to.split('#')

    // do nothing if url would not change
    if (url === state.url && hash === state.hash) {
      return state
    }

    window.history.pushState({ url, hash }, '', to)

    if (hash) {
      // window.scrollTo without window.location.hash will not work
      // :target css pseudoclasses won't work without
      // resetting the hash here
      const t = document.getElementById(hash)
      if (t) {
        window.scrollTo(0, t.scrollTop)
      }
      window.location.hash = hash
    } else {
      // we want to scroll to the top if there is no hash
      window.scrollTo(0, 0)
    }

    return {
      ...state,
      url,
      hash,
      prev: state.url,
    }
  },
}

export const helpers = {
  mapClickToGo: e => {
    e.preventDefault()
    return e
  },

  listenPopState: (dispatch, action) => {
    const listener = e => dispatch(action, e)

    addEventListener('popstate', listener)

    return () => removeEventListener('popstate', listener)
  },
}

export const subscriptions = [['helpers.listenPopState', 'actions.pop']]

export const global = {
  actions: {
    go: true,
    pop: true,
  },
}
