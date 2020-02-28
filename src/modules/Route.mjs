export const View = ({ page, state }, children) => [
  Header(state),
  div({ class: 'Page', id: 'page' }, [page, children]),
  Footer(state),
]
