export const View = (props = {}) => {
  CHECK_PROPS(props, propTypes, 'Menu')
  const { items, class: className = 'Menu', collapse = true, state } = props

  if (!items.length) {
    return
  }

  if (state.hash) {
    state.url += `#${state.hash}`
  }

  return nav({ className }, ul(items.map(i => MenuItem({ ...i, state, collapse }))))
}

export const style = {
  float: 'right',
  margin: '1.5em 0 0',
  position: 'relative',

  li: {
    float: 'left',
    margin: '0 .5em 0 0',

    '&.active': {
      '> a': {
        textDecoration: 'underline',
      },
    },
    a: {
      display: 'block',
    },
  },

  ul: {
    ul: {
      position: 'absolute',
      left: 0,
    },
  },
}

export const propTypes = {
  Menu: [
    { key: 'items', type: 'array', required: true },
    { key: 'hash', type: 'string' },
    { key: 'url', type: 'string' },
    { key: 'collapse', type: 'boolean' },
    { key: 'class', type: 'string' },
  ],
}
