const View = (props = 'menu') => state => {
  if (typeof props === 'string') {
    props = { name: props }
  }

  let { name = 'menu', class: cl = 'Menu', items = [], collapse = true } = props
  let { url, [name]: maybeItems = [] } = state
  items = !items.length ? maybeItems : items

  if (!items.length) {
    return
  }

  if (state.hash) {
    url += `#${state.hash}`
  }

  return nav({ class: !cl.includes('Menu') ? `Menu ${cl}` : cl }, ul(items.map(i => MenuItem({ ...i, url, collapse }))))
}

const style = {
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
  },

  ul: {
    ul: {
      position: 'absolute',
      left: 0,
    },
  },
}

module.exports = {
  style,
  View,
}
