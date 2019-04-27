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

  const Item = ({ text, items = [], ...item }) => {
    // if the item has no values, we quit
    if (!item.to && !text) {
      return
    }

    const p = {}
    if (item.to === url) {
      p.class = 'active'
    }

    let children
    if (items && (url.startsWith(item.to) || !collapse)) {
      children = ul(items.map(i => Item(i)))
    }

    return li(p, [item.to ? Link(item, text) : span(item, text), children])
  }

  return nav({ class: !cl.includes('Menu') ? `Menu ${cl}` : cl }, ul(items.map(i => Item(i))))
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
