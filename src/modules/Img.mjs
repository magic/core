export default props => () => {
  if (typeof props === 'string') {
    props = {
      src: props,
    }
  }

  if (!props.src) {
    return
  }

  if (!props.alt) {
    if (props.title) {
      props.alt = props.title
    } else {
      props.role = 'presentation'
      props.alt = ''
    }
  }

  return img(props)
}
