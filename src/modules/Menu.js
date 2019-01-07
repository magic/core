const Menu = {
  actions: {
    go: e => state => {
      e.preventDefault()
      let url = state.url
      if (e.target && e.target.href) {
        url = e.target.href.replace(window.location.origin, '')
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

  View: ({ name = 'menu', between = false, pre = false, post = false }) => (state, actions) => {
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
          } else {
            props.class = null
          }

          return [
            pre && li(pre),
            li(props, Link.View(item)),
            between && i < state[name].length - 1 ? li(' - ') : '',
            post && li(post),
          ]
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
