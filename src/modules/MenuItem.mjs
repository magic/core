export const View = props => {
  CHECK_PROPS(props, propTypes, 'MenuItem', true)
  const { text, items = [], url, state, parentTo = undefined, collapse, ...item } = props
  const { root } = state

  // if the item has no values, we quit
  if (!item.to && !text) {
    return
  }

  const p = {
    class: {},
  }

  let to = item.to

  if (to.startsWith('/#')) {
    to = to.substr(1)
  }

  const first = item.to[0]
  const isLocal = first === '/' || first === '-' || first === '#'

  if (parentTo && isLocal) {
    if (first === '-' || first === '#') {
      to = parentTo + to
    } else {
      const start = to.split('/')[1]
      if (start) {
        const startsLikeParentEnds = parentTo.endsWith(`/${start}/`)

        if (!startsLikeParentEnds && isLocal) {
          to = parentTo + to
        }
      }
    }
  }

  if ((item.to !== '/' && url.endsWith(item.to)) || item.to === url) {
    p.class.active = true
  }

  const isRooted = to.startsWith(root)
  if (root && isLocal && !isRooted) {
    to = root + to
  }

  item.to = to.replace(/\/\//g, '/')

  let children = []
  const active = url && url.includes(item.to)
  if ((items.length && active) || !collapse) {
    children = ul(items.map(i => MenuItem({ parentTo: item.to, url, state, collapse, ...i })))
  }

  return li(p, [item.to ? Link(item, text) : span(item, text), children])
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
