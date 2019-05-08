module.exports = page => (state, actions) => div(
  { class: 'wrapper' },
  [
    Header,
    page
      ? div({ class: 'page' }, page(state, actions))
      : div({ class: 'page' }, '404 - not found'),
    Footer,
  ]
)