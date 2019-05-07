const Menu = {}

Menu.View = (props = 'menu') => state => {
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

  return nav(
    { class: !cl.includes('Menu') ? `Menu ${cl}` : cl },
    ul(items.map(i => Menu.Item({ ...i, url, collapse }))),
  )
}

Menu.style = {
  float: 'right',
  margin: '1.5em 0 0',
  position: 'relative',

  ul: {
    ul: {
      position: 'absolute',
      left: 0,
    },
  },
}

Menu.Item = ({ url, text, items = [], parentTo = undefined, collapse, ...item }) => {
  // if the item has no values, we quit
  if (!item.to && !text) {
    return
  }

  const p = {
    class: 'MenuItem'
  }
  if (item.to === url) {
    p.class += ' active'
  }

  if (parentTo) {
    const isExternal = item.to.includes('://')
    const isAbsolute = item.to.startsWith('/')
    const startsLikeParent = !parentTo || item.to.startsWith(parentTo)
    if (!startsLikeParent && !isAbsolute && !isExternal) {
      if (!parentTo.endsWith('/') && !item.to.startsWith('-')) {
        parentTo = `${parentTo}/`
      }

      item.to = parentTo + item.to
    }
  }

  let children = []
  if (items.length && (url.startsWith(item.to) || !collapse)) {
    children = ul(items.map(i => Menu.Item({ parentTo: item.to, url, collapse, ...i })))
  }

  return li(p, [item.to ? Link(item, text) : span(item, text), children])
}

Menu.Item.style =  {
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
}

module.exports = Menu
