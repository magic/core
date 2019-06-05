export const View = ({ page, state }) => [
  Header(state),
  div({ class: 'Page' }, page),
  Footer(state),
]