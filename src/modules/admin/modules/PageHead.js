module.exports = (state) =>
  (state.logo || state.menu || state.tagline) && header({ class: 'main' }, [
    (state.logo || state.logotext) && div({ class: 'logo-wrapper' }, [
      state.logo &&
        img({ class: 'logo', src: state.logo, alt: '', role: 'presentation' }),
      state.logotext && span({ class: 'logo-text' }, state.logotext),
    ]),
    state.menu && Menu.View,
  ])