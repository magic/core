export const View = ({ img, text, ...state }) =>
  Link({ to: state.root, class: 'Logo' }, [logo && Img(img), text && span(text)])
