export const View = ({ to, ...p }, children) => {
  const { href, text, nofollow, noreferrer, onclick = false, ...props } = p
  to = to || href || ''
  props.href = to

  if (to && to.startsWith('/') && !to.startsWith(`//`)) {
    props.onclick = [actions.go]
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
  go: (state, props = {}) => {
    console.log({ props, state })
    e.preventDefault()
    return false
  },
}

export const global = {
  actions: {
    go: true,
  },
}
