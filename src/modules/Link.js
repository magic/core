const Link = ({ to, href, text, nofollow, noreferrer, ...props }, children) => (_, actions) => {
  to = to || href || ''
  props.href = to

  if (to && to.startsWith('/') && !to.startsWith(`//`)) {
    props.onclick = e => actions.go({ e, to })
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

Link.actions = {
  go: props => state => {
    // trigger event if history api does not exist
    if (!window.history) {
      return true
    }
    const { to } = props
    const e = props.e ? props.e : props
    e.preventDefault()

    let url = state.url
    let [uri, hash = ''] = url.split('#')

    if (to) {
      url = to.replace(window.location.origin, '')
      const [u, h = ''] = url.split('#')
      uri = u
      hash = h
      const stateHash = state.hash ? `#${state.hash}` : ''
      const stateUrl = state.url + stateHash
      if (url !== stateUrl) {
        window.history && window.history.pushState({ uri }, '', url)
        if (!hash) {
          window.scrollTo(0,0)
        }
      }
    } else {
      if (e.state) {
        url = e.state.uri
      } else {
        url = '/'
      }
    }

    if (hash) {
      // try to make sure the page has changed by the time we scroll
      // if not, we simply lose the scroll
      window.setTimeout(() => {
        const ele = document.getElementById(hash)
        if (ele) {
          window.scrollTo(0, ele.offsetTop)
        }
      }, 10)
    }

    return {
      url: uri,
      hash,
      prev: state.url,
    }
  },
}

Link.global = {
  actions: {
    go: true,
  },
}

module.exports = Link
