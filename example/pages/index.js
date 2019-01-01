const Wrapper = require('../assets/Wrapper')

module.exports = {
  state: {
    title: 'h1 indexpage',
    content: ['div indexpage'],
    description: 'custom description',
  },

  Body: (state, actions) => [
    h1(state.title),
    Count.View(state, actions),
    div(state.content.map(p)),
    Wrapper.View(state, actions),
  ],
}
