export const View = props => {
  if (typeof props === 'string') {
    props = {
      src: props,
    }
  }

  CHECK_PROPS(props, propTypes, 'Img')

  const { loading = 'lazy' } = props

  if (!props.src) {
    return
  }

  if (!props.hasOwnProperty('alt')) {
    if (props.title) {
      props.alt = props.title
    } else {
      props.alt = ''
    }
  }

  props.loading = loading

  return img(props)
}

export const propTypes = {
  Img: [
    { type: 'string' },

    { key: 'src', type: 'string', required: true },
    { key: 'alt', type: 'string' },
    { key: 'role', type: 'string' },
    { key: 'title', type: 'string' },
  ],
}
