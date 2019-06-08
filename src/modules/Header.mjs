export const View = (props = {}, children = []) => {
  CHECK_PROPS(props, propTypes, 'Header')

  const { logo, menu, logotext, ...state } = props
  if (!logo && !menu && !logotext) {
    return
  }

  return header({ class: 'Header' }, [
    (logo || logotext) &&
      Link({ to: state.root, class: 'Logo' }, [logo && Img(logo), logotext && span(logotext)]),
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
