module.exports = {
  state: {
    title: 'h1 deep/index',
    htmlTitle: 'testing the html title tag',
  },

  actions: {
    deepAction: state => ({ test: !state.test }),
  },

  View: (state, actions) => [h1(state.title), div('page content'), Count.View(state, actions)],
}
