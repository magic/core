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

  View: ({ name = 'menu' }) => (state, actions) => {
    if (!state[name] || !state[name].length) {
      return
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', actions.go)
    }

    return nav({ class: 'Menu' }, [
      ul(
        state[name].map(item => [
          li({ class: state.url === item.to ? 'active' : '' }, [
            a({ href: item.to, onclick: actions.go }, item.text),
          ]),
        ]),
      ),
    ])
  },
}

module.exports = Menu
