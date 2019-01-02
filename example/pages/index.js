module.exports = {
  state: {
    title: 'h1 indexpage',
    description: 'custom description',
  },

  Body: (state, actions) => [
    h1(state.title),
    div([
      p('index page content'),
      p('can stretch multiple lines'),
      ul([
        li('and contain'),
        li('lists of content'),
      ]),
    ]),
    Count.View(state, actions),
    Wrapper.View(state, actions),
  ],
}
