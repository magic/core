const Menu = {
  actions: {
    go: e => state => {
      e.preventDefault()
      const url = e.target.href.replace(window.location.origin, '')

      if (url !== state.url) {
        window.history && window.history.pushState({ urlPath: url }, '', url)

        return {
          url,
          prev: state.url,
        }
      }
    },
  },

  View: (state, actions) => {
    if (!state.menu || !state.menu.length) {
      return
    }

    return nav({ class: 'Menu' }, [
      ul(
        state.menu.map(item => [
          li({ class: state.url === item.to ? 'active' : '' }, [
            a({ href: item.to, onclick: actions.go }, item.text),
          ]),
        ]),
      ),
    ])
  },
}

module.exports = Menu
