const style = {
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
  },

  '&.right': {
    float: 'right',
  },

  '&.block': {
    li: {
      clear: 'both',
      margin: '0.5em 0 0',
    },
  },

  ul: {
    ul: {
      position: 'absolute',
      left: 0,
    },
  },
}

const View = (props = 'menu') => state => {
  if (typeof props === 'string') {
    props = { name: props }
  }

  const { name = 'menu', between = false } = props
  let { class: cl = 'Menu', items = [] } = props
  items = !items.length && state[name] ? state[name] : items

  const hash = state.hash ? `#${state.hash}` : ''
  const url = state.url + hash

  if (!cl) {
    cl = 'Menu'
  } else if (!cl.includes('Menu')) {
    cl = `Menu ${cl}`
  }

  if (!items.length) {
    return
  }

  return nav(
    { class: cl },
    ul(
      items.map(({ items = [], ...item }, i) => {
        // if the item has no values, we quit
        if (!item.to && !item.text) {
          return
        }
        const props = {}
        if (item.to === url) {
          props.class = 'active'
        }

        let children
        if (items && url.startsWith(item.to)) {
          children = ul(
            items.map(itm => {
              const p = {}
              if (itm.to === url) {
                p.class += 'active'
              }
              return li(p, Link(itm))
            }),
          )
        }

        return [li(props, [item.to ? Link(item) : span(item.text), children]), between && i < items.length - 1 ? li(between) : '']
      }),
    ),
  )
}

module.exports = {
  style,
  View,
}
