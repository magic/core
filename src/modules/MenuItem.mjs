export const View = props => {
  CHECK_PROPS(props, propTypes, 'MenuItem', true)

  const { text, items = [], url, parentTo = undefined, collapse, ...item } = props

  const p = {
    class: {},
  }

  let { to } = item

  const first = item.to[0]

  if (parentTo && (first === '-' || first === '#')) {
    to = parentTo + to
  }

  item.to = to.replace(/\/\//g, '/')

  if (item.to === url) {
    p.class.active = true
  }

  let children = []
  const active = url.startsWith(item.to) || !collapse

  if (active && items.length) {
    children = ul(items.map(i => MenuItem({ parentTo: item.to, url, collapse, ...i })))
  }

  return li(p, [item.to ? MenuLink(item, text) : span(item, text), children])
}

export const propTypes = {
  MenuItem: [
    { key: 'url', type: 'string' },
    { key: 'text', type: ['string', 'array'] },
    {
      key: 'items',
      type: 'array',
      item: {
        type: 'object',
        keys: [
          { key: 'to', type: 'string' },
          { key: 'text', type: 'string' },
        ],
      },
    },
    { key: 'parentTo', type: 'string' },
    { key: 'collapse', type: 'boolean' },
    { key: 'to', type: 'string' },
  ],
}
