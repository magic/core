export const View = ({ logo, logotext, ...state }) =>
  Link({ to: state.root, class: 'Logo' }, [logo && Img(logo), logotext && span(logotext)])
