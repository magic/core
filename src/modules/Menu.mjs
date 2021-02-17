export const View = (props = {}) => {
  CHECK_PROPS(props, propTypes, 'Menu')

  const { collapse = true, menu, hash } = props
  let { class: className = '', url } = props

  if (!className.includes('Menu')) {
    className = `Menu ${className}`.trim()
  }

  if (hash && !url.endsWith(hash)) {
    url += `#${hash}`
  }

  return nav({ className }, ul(menu.map(item => MenuItem({ ...item, url, collapse }))))
}

export const style = {
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
    a: {
      display: 'block',
    },
  },

  ul: {
    ul: {
      position: 'absolute',
      left: 0,
    },
  },
}

export const propTypes = {
  Menu: [
    { key: 'menu', type: 'array', required: true },
    { key: 'hash', type: 'string' },
    { key: 'url', type: 'string' },
    { key: 'collapse', type: 'boolean' },
    { key: 'class', type: 'string' },
  ],
}
