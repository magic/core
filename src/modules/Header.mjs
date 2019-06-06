export const View = (props = {}, children = []) => {
  CHECK_PROPS(props, propTypes, 'Header')

  const { logo, menu, tagline, logotext, ...state } = props
  if (!logo && !menu && !tagline) {
    return
  }

  return header({ class: 'Header' }, [
    (logo || logotext) &&
      Link({ to: state.root, class: 'Logo' }, [
        logo && Img(logo),
        logotext && span(logotext),
      ]),
    menu && Menu({ state, items: menu }),
    children,
  ])
}

export const propTypes = {
  Header: [
    { key: 'logo', type: 'string' },
    { key: 'logotext', type: 'string' },
    { key: 'menu', type: 'array' },
  ],
}
