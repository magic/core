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

  return a(props, text || children)
}

Link.actions = {
  go: props => state => {
    const { to } = props
    const e = props.e ? props.e : props
    e.preventDefault()

    if (typeof document !== 'undefined') {
      document.getElementsByTagName('html')[0].scrollTop = 0
    }

    let url = state.url

    if (to) {
      url = to.replace(window.location.origin, '')
      if (url !== state.url) {
        window.history && window.history.pushState({ urlPath: url }, '', url)
      }
    } else {
      if (e.state) {
        url = e.state.urlPath
      } else {
        url = '/'
      }
    }

    return {
      url,
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
