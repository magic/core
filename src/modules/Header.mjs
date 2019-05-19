export const Header = ({ logo, menu, tagline, logotext, ...state }) =>
  (logo || menu || tagline) &&
  header({ class: 'Header' }, [
    (logo || logotext) &&
      Link({ to: '/', class: 'LogoWrapper' }, [
        logo && Img({ class: 'Logo', src: logo }),
        logotext && span({ class: 'LogoText' }, logotext),
      ]),
    menu && Menu({ ...state, items: menu }),
  ])
