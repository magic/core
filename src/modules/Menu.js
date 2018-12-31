const Menu = state =>
  state.menu &&
  state.menu.length &&
  nav({ class: 'Menu' }, [ul(state.menu.map(item => [li([a({ href: item.to }, item.text)])]))])

module.exports = Menu
