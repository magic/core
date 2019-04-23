const Menu = {
  style: {
    '.Menu': {
      float: 'right',
      margin: '1.5em 0 0',
      position: 'relative',

      li: {
        float: 'left',
        margin: '0 .5em 0 0',
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

      '.active': {
        '> a': {
          textDecoration: 'underline',
        },
      },

      ul: {
        ul: {
          position: 'absolute',
          left: 0,
        },
      },
    },
  },

  View: ({ name = 'menu', class: cl = '', between = false, items = [] }) => state => {
    if (!items.length && (!state[name] || !state[name].length)) {
      return
    }

    if (!items.length) {
      items = state[name]
    }

    return nav({ class: `Menu ${cl}` }, [
      ul(
        items.map((menuItem, i) => {
          const { items, ...item } = menuItem
          const props = {}
          const hash = state.hash ? `#${state.hash}` : ''
          const url = state.url + hash
          if (item.to === url) {
            props.class = 'active'
          }

          let children
          if (items && url.startsWith(item.to)) {
            children = ul(items.map(itm => {
              const p = {}
              if (itm.to === url) {
                p.class = 'active'
              }
              return li(p, Link(itm))
            }))
          }

          return [
            li(props, [Link(item), children]),
            between && i < state[name].length - 1 ? li(between) : '',
          ]
        }),
      ),
    ])
  },
}

module.exports = Menu
