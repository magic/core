export const View = props => {
  CHECK_PROPS(props, propTypes, 'MenuItem', true)

  const { collapse, items = [], text, url, ...item } = props

  const p = {
    class: {},
  }

  let { to } = item

  if (to === url) {
    p.class.active = true
  }

  let children = []
  const active = !collapse || url.includes(to)

  if (active && items.length) {
    children = ul(items.map(i => MenuItem({ url, collapse, ...i })))
  }

  return li(p, [to ? Link(item, text) : span(item, text), children])
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
    { key: 'collapse', type: 'boolean' },
    { key: 'to', type: 'string' },
  ],
}
