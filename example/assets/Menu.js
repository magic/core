module.exports = {
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
          li({ class: state.url === item.to ? 'active' : '' }, [Link.View(item)]),
        ]),
      ),
    ])
  },
}