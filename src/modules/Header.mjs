export const View = props => {
  CHECK_PROPS(props, propTypes, 'Header')

  const { logo, menu, tagline, logotext, ...state } = props
  if (!logo && !menu && !tagline) {
    return
  }

  return header({ class: 'Header' }, [
    (logo || logotext) &&
      Link({ to: '/', class: 'LogoWrapper' }, [
        logo && Img({ class: 'Logo', src: logo }),
        logotext && span({ class: 'LogoText' }, logotext),
      ]),
    menu && Menu({ ...state, items: menu }),
  ])
}

export const propTypes = {
  Header: [
    { key: 'logo', type: 'string' },
    { key: 'logotext', type: 'string' },
    { key: 'menu', type: 'array' },
  ],
}
