export const View = ({ page, state }) => [
  Header(state),
  div({ class: 'Page', id: 'page' }, page),
  Footer(state),
]
