export const View = ({ to, ...p }, children) => {
  const { href, text, nofollow, noreferrer, onclick = false, ...props } = p
  to = to || href || ''
  props.href = to

  if (to && to.startsWith('/') && !to.startsWith(`//`)) {
    props.onclick = [actions.go, e => ({ e, to })]
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
  go: (state, { e, to }) => {
    // trigger event (page reload with new url) if history api does not exist
    if (typeof window === 'undefined' || !window.history) {
      return true
    }

    e.preventDefault()

    let url = state.url
    let [uri, hash = ''] = url.split('#')

    if (to) {
      // if we have clicked a link, we have a to
      url = to.replace(window.location.origin, '')
      url = url.startsWith(state.root) ? url : `${state.root}${url}`.replace(/\/\//g, '/')
      const [u, h = ''] = url.split('#')
      uri = u
      // only set the hash if it is set and not set to '/'
      hash = !h || h === '/' ? '' : h

      const stateHash = state.hash ? `#${state.hash}` : window.location.hash
      const stateUrl = state.url + stateHash

      if (url !== stateUrl || hash !== stateHash) {
        window.history && window.history.pushState({ uri }, '', url)

        // make sure we scroll to the top if there is no hash
        // this simulates the page reload
        if (!hash) {
          window.scrollTo(0, 0)
        }
      }
    } else {
      // in case of popstate events firing, we do not have props.to
      // but instead the e is a history event
      console.log(e.state)
      if (e.state) {
        uri = e.state.uri
      } else {
        uri = '/'
      }
    }

    // window exists for sure, but make sure window.location also does
    if (window.location && hash) {
      const target = document.getElementById(hash)
      if (target) {
        const top = target.offsetTop
        window.scrollTo(0, top)
        window.location.hash = hash
      }
    }

    return {
      ...state,
      url: uri,
      hash,
      prev: state.url,
    }
  },
}

export const global = {
  actions: {
    go: true,
  },
}
