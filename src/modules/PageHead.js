module.exports = state =>
  (state.logo || state.menu || state.tagline) &&
  header({ class: 'main' }, [
    (state.logo || state.logotext) &&
      div({ class: 'logo-wrapper' }, [
        state.logo && Img({ class: 'logo', src: state.logo }),
        state.logotext && span({ class: 'logo-text' }, state.logotext),
      ]),
    state.menu && Menu.View,
  ])
