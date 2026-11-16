/**
 * @param {Record<string, unknown> & { logo?: string, menu?: unknown[], logotext?: string, root?: string, theme?: string, hash?: string, url?: string }} props
 * @param {unknown[]} [children]
 */
export const View = (props = {}, children = []) => {
  CHECK_PROPS(props, propTypes, 'Header')

  const { logo, menu, logotext, root, theme, hash, url } = props

  if (!logo && !menu && !logotext) {
    return
  }

  return header({ class: 'Header' }, [
    (logo || logotext) && Logo({ root, theme, logo, logotext }),
    menu && Menu({ url, hash, menu }),
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
