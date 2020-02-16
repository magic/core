export const View = ({ img, text, ...state }) =>
  Link({ to: state.root, class: 'Logo' }, [img && Img(img), text && span(text)])
