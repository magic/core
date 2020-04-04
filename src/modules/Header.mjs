export const View = (props = {}, children = []) => {
  CHECK_PROPS(props, propTypes, 'Header')

  const { logo, menu, logotext, ...state } = props
  if (!logo && !menu && !logotext) {
    return
  }

  return header({ class: 'Header' }, [
    (logo || logotext) && Logo({ root: state.root, theme: state.theme, img: logo, text: logotext }),
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
