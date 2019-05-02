const MenuItem = ({ url, text, items = [], collapse, ...item }) => {
  // if the item has no values, we quit
  if (!item.to && !text) {
    return
  }

  const p = {}
  if (item.to === url) {
    p.class = 'active'
  }

  let children = []
  if (items && (url.startsWith(item.to) || !collapse)) {
    children = ul(items.map(i => MenuItem({ url, collapse, ...i })))
  }

  return li(p, [item.to ? Link(item, text) : span(item, text), children])
}

module.exports = MenuItem