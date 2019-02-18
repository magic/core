const Menu = {
  style: {
    '.Menu': {
      li: {
        float: 'left',
        margin: '0 .5em 0 0',
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
    },
  },

  View: ({ name = 'menu', between = false }) => (state, actions) => {
    if (!state[name] || !state[name].length) {
      return
    }

    return nav({ class: 'Menu' }, [
      ul(
        state[name].map((item, i) => {
          const props = {}
          const isEqual = item.to === state.url
          const isActive = item.to !== '/' && state.url.startsWith(item.to)
          if (isEqual || isActive) {
            props.class = 'active'
          }

          return [li(props, Link(item)), between && i < state[name].length - 1 ? li(' - ') : '']
        }),
      ),
    ])
  },
}

module.exports = Menu
