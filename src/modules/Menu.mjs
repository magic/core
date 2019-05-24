export const View = p => {
  CHECK_PROPS(p, propTypes, 'Menu')
  let { items, hash, url = '', root, class: cl = 'Menu', collapse = true } = p

  if (!items.length) {
    return
  }

  if (hash) {
    url += `#${hash}`
  }

  return nav({ class: cl }, ul(items.map(i => MenuItem({ ...i, root, url, collapse }))))
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

export const propTypes = {
  Menu: [
    { key: 'items', type: 'array', required: true },
    { key: 'hash', type: 'string' },
    { key: 'url', type: 'string' },
    { key: 'collapse', type: 'boolean' },
    { key: 'class', type: 'string' },
  ],
}
