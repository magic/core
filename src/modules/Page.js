module.exports = page => (state, actions) => div(
  { class: 'Wrapper' },
  [
    Header,
    page
      ? div({ class: 'Page' }, page(state, actions))
      : div({ class: 'Page' }, '404 - not found'),
    Footer,
  ]
)