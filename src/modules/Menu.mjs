export const Menu = p => {
  CHECK_PROPS(p, propTypes, 'Menu')
  let { items, hash, url = '', root, class: cl = 'Menu', collapse = true } = p

  if (!items.length) {
    return
  }

  if (hash) {
    url += `#${hash}`
  }

  return nav({ class: cl }, ul(items.map(i => Menu.Item({ ...i, root, url, collapse }))))
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

export const propTypes = Menu.propTypes = {
  Menu: [
    { key: 'items', type: 'array', required: true },
    { key: 'hash', type: 'string' },
    { key: 'url', type: 'string' },
    { key: 'collapse', type: 'boolean' },
    { key: 'class', type: 'string' },
  ],
  MenuItem: [
    { key: 'url', type: 'string' },
    { key: 'text', type: ['string', 'array'] },
    { key: 'items', type: 'array' },
    { key: 'parentTo', type: 'string' },
    { key: 'collapse', type: 'boolean' },
    { key: 'to', type: 'string' },
  ]
}

Menu.Item = props => {
  CHECK_PROPS(props, propTypes, 'MenuItem')
  const { url, text, items = [], root, parentTo = undefined, collapse, ...item } = props
  // if the item has no values, we quit
  if (!item.to && !text) {
    return
  }

  const p = {
    class: 'MenuItem',
  }


  if (parentTo) {
    const first = item.to[0]
    const isLocal = first === '#' || first === '/' || first === '-'
    const startsLikeParent = item.to.startsWith(parentTo)
    if (!startsLikeParent && isLocal) {
      if (parentTo.endsWith('/') && item.to.endsWith('/')) {
        item.to = item.to.substr(1)
      }

      item.to = parentTo + item.to
    }
  }

  const active = url && url.includes(item.to)
  if (url.endsWith(item.to)) {
    p.class += ' active'
  }

  let children = []
  if ((items.length && active) || !collapse) {
    children = ul(items.map(i => Menu.Item({ parentTo: item.to, url, collapse, ...i })))
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
