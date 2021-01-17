// Page Module
export const View = ({ page, state }, children) => {
  const magicProps = {
    id: 'Magic',
    class: state.pageClass,
  }

  const wrapperProps = {
    class: {
      Wrapper: true,
    },
  }

  return main(
    magicProps,
    div(wrapperProps, [
      Header(state),
      div({ class: 'Page', id: 'page' }, page(state)),
      Footer(state),
      children,
    ]),
  )
}

export const Link = ({ to, action = actions.go, ...p }, children = []) => {
  const { href, text, nofollow, noreferrer, ...props } = p
  to = to || href || ''
  props.href = to

  const isLocal = to[0] === '/' || to[0] === '#'

  if (isLocal) {
    props.onclick = [action, lib.preventDefault]
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

export const state = {
  pageClass: {},
}

export const actions = {
  pop: (state, e) => {
    let { pathname: url, hash } = window.location
    hash = hash.substring(1)

    let top = 0

    if (e.state) {
      url = e.state.url
      hash = e.state.hash
      top = e.state.scrollY || 0
    }

    if (hash) {
      window.location.hash = hash
    } else {
      window.scroll({ top })
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
      if (hash) {
        window.location.hash = hash
      }
      return state
    }

    const title = state.pages && state.pages[url] && state.pages[url].title
    if (title) {
      document.title = state.title = title
    }

    if (url !== state.url) {
      if (!hash) {
        window.scrollTo({ top: 0 })
      }
    } else {
      window.location.hash = hash
    }

    const { scrollY } = window
    window.history.pushState({ url, hash, scrollY }, state.title, to)

    return {
      ...state,
      url,
      hash,
      prev: state.url,
    }
  },
}

export const helpers = {
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
  state: {
    pageClass: true,
  },
}
