module.exports = props => () => {
  if (!props.src) {
    return
  }

  if (!props.alt) {
    props.role = 'presentation'
    props.alt = ''
  }

  return img(props)
}
