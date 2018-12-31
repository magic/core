const Wrapper = require('../assets/Wrapper')

module.exports = {
  state: {
    title: 'h1 indexpage',
    content: ['div indexpage'],
    description: 'custom description',
  },

  actions: {
    testAction: () => (state, actions) => ({ test: !state.test }),
    setTitle: () => state => ({ title: state.title + ' test' }),
  },

  Body: (state, actions) => [
    h1(state.title),
    div({ onclick: actions.setTitle }, state.content.map(p)),
    Wrapper.View(state, actions),
  ],
}
