module.exports = {
  View: page => (state, actions) =>
    div(
      { id: 'magic' },
      div({ class: 'wrapper' }, [
        (state.logo || state.menu) && header({ class: 'main' }, [
          state.logo &&
            img({ class: 'logo', src: state.logo, height: 100, width: 200, role: 'presentation' }),
          state.menu && Menu.View,
        ]),
        page
          ? div({ class: 'page' }, page(state, actions))
          : div({ class: 'page' }, '404 - not found'),
        Footer.View,
      ]),
    ),
}
