export const Menu = ({ items, hash, url, root, ...props }) => {
  let { class: cl = 'Menu', collapse = true } = props

  if (!items.length) {
    return
  }

  if (hash) {
    url += `#${hash}`
  }

  return nav({ class: cl }, ul(items.map(i => Menu.Item({ ...i, url, root, collapse }))))
}

export const style = {
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

Menu.Item = ({ url, text, items = [], parentTo = undefined, collapse, root, ...item }) => {
  // if the item has no values, we quit
  if (!item.to && !text) {
    return
  }

  const p = {
    class: 'MenuItem',
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

  item.to = item.to.startsWith(root) ? item.to : `${root}${item.to.substr(1)}`
  const active = url.startsWith(item.to)
  if (url === item.to) {
    p.class += ' active'
  }

  let children = []
  if ((items.length && active) || !collapse) {
    children = ul(items.map(i => Menu.Item({ parentTo: item.to, url, root, collapse, ...i })))
  }

  return li(p, [item.to ? Link(item, text) : span(item, text), children])
}

Menu.Item.style = {
  '.MenuItem': {
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
}
