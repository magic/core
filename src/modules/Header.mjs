export const View = (props = {}, children = []) => {
  CHECK_PROPS(props, propTypes, 'Header')

  const { logo, menu, logotext, root, theme, hash, url } = props

  if (!logo && !menu && !logotext) {
    return
  }

  return header({ class: 'Header' }, [
    (logo || logotext) && Logo({ root, theme, logo, logotext }),
    menu && Menu({ url, hash, root, items: menu }),
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
