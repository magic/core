export const Header = state =>
  (state.logo || state.menu || state.tagline) &&
  header({ class: 'Header' }, [
    (state.logo || state.logotext) &&
      Link({ to: '/', class: 'LogoWrapper' }, [
        state.logo && Img({ class: 'Logo', src: state.logo }),
        state.logotext && span({ class: 'LogoText' }, state.logotext),
      ]),
    state.menu && Menu,
  ])

export default Header
