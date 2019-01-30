const Menu = {
  actions: {
    go: to => e => state => {
      e.preventDefault()
      let url = state.url

      if (to) {
        url = to.replace(window.location.origin, '')
        if (url !== state.url) {
          window.history && window.history.pushState({ urlPath: url }, '', url)
        }
      } else {
        if (e.state) {
          url = e.state.urlPath
        } else {
          url = '/'
        }
      }
      return {
        url,
        prev: state.url,
      }
    },
  },

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

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', actions.go)
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

  global: {
    actions: {
      go: true,
    },
  },
}

module.exports = Menu
