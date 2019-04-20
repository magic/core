const Menu = {
  style: {
    '.Menu': {
      float: 'right',
      margin: '1.5em 0 0',

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
        textDecoration: 'underline',
      },

      ul: {
        ul: {
          position: 'absolute',
        },
      },
    },
  },

  View: ({ name = 'menu', between = false }) => (state, actions) => {
    if (!state[name] || !state[name].length) {
      return
    }

    return nav({ class: 'Menu' }, [
      ul(
        state[name].map((menuItem, i) => {
          const { items, ...item } = menuItem
          const props = {}
          const hash = state.hash ? `#${state.hash}` : ''
          const url = state.url + hash
          if (item.to === url) {
            props.class = 'active'
          }

          let children
          if (items && url.startsWith(item.to)) {
            children = ul(items.map(item => li([Link(item)])))
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
