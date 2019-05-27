export const propTypes = {
  MenuItem: [
    { key: 'url', type: 'string' },
    { key: 'text', type: ['string', 'array'] },
    { key: 'items', type: 'array' },
    { key: 'parentTo', type: 'string' },
    { key: 'collapse', type: 'boolean' },
    { key: 'to', type: 'string' },
  ],
}
export const View = props => {
  CHECK_PROPS(props, propTypes, 'MenuItem')
  const { url, text, items = [], root, parentTo = undefined, collapse, ...item } = props
  // if the item has no values, we quit
  if (!item.to && !text) {
    return
  }

  const p = {
    class: 'MenuItem',
  }
  const first = item.to[0]
  const isLocal = first === '#' || first === '/' || first === '-'

  if (parentTo) {
    const startsLikeParentEnds = parentTo.endsWith(item.to.split('#')[0])

    if (!startsLikeParentEnds && isLocal) {
      if (parentTo.endsWith('/') && item.to.endsWith('/')) {
        item.to = item.to.substr(1)
      }

      item.to = parentTo + item.to
    }
  }

  const isRooted = item.to.startsWith(root)
  if (isLocal && !isRooted) {
    item.to = `${root}${item.to}`.replace(/\/\//g, '/')
  }

  const active = url && url.includes(item.to)
  if (url.endsWith(item.to)) {
    p.class += ' active'
  }

  let children = []
  if ((items.length && active) || !collapse) {
    children = ul(items.map(i => MenuItem({ parentTo: item.to, root, url, collapse, ...i })))
  }

  return li(p, [item.to ? Link(item, text) : span(item, text), children])
}

const MenuItem = View

export const style = {
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
