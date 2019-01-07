module.exports = {
  View: ({ to, text, nofollow, noreferrer }, children) => (_, actions) => {
    const props = {
      href: to,
    }

    if (to.startsWith('/') && !to.startsWith(`//`)) {
      props.onclick = actions.go
    } else {
      props.rel = 'noopener'
      if (nofollow) {
        props.rel += ' nofollow'
      }
      if (noreferrer) {
        props.rel += ' noreferrer'
      }
      props.target = '_blank'
    }

    return a(props, text || children)
  },
}
