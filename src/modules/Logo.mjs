export const View = ({ logo, logotext, root }) =>
  CHECK_PROPS({ logo, logotext, root }, propTypes, 'Logo') &&
  Link({ to: root, class: 'Logo' }, [logo && Img(logo), logotext && span(logotext)])

export const propTypes = {
  Logo: [
    { key: 'logo', type: 'string' },
    { key: 'logotext', type: 'string' },
    { key: 'root', type: 'string', reqired: true },
  ],
}
