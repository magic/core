module.exports = page => (state, actions) =>
  div({ class: 'Wrapper' }, [
    Header,
    div({ class: 'Page' }, page ? page(state, actions) : '404 - not found'),
    Footer,
  ])
