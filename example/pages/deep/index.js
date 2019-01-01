module.exports = {
  state: {
    title: 'h1 deep/index',
    content: ['div deep/index'],
    htmlTitle: 'testing the html title tag',
    url: '/deep/',
  },

  actions: {
    deepAction: state => ({ test: !state.test }),
  },

  Body: (state, actions) => [
    h1(state.title),
    div(state.content.map(p)),
    Count.View(state, actions),
  ],
}
