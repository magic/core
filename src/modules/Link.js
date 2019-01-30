module.exports = ({ to, href, text, nofollow, noreferrer }, children) => (_, actions) => {
  to = to || href || ''
  const props = {
    href: to,
  }

  if (to && to.startsWith('/') && !to.startsWith(`//`)) {
    props.onclick = actions.go(to)
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
}
