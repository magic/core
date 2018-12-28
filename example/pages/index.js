module.exports = ({ p, meta, title, h1, div, Wrapper }) => ({
  state: {
    title: 'h1 indexpage',
    content: ['div indexpage'],
  },

  actions: {
    testAction: (state, actions) => ({ test: !state.test }),
    setTitle: state => ({ title: state.title + 'test' }),
  },

  Body: (state, actions) => [
    h1(state.title),
    div({ onclick: actions.setTitle }, state.content.map(p)),
    Wrapper(state, actions),
  ],

  Head: state => [
    title(`${state.app.title} - ${state.title}`),
    meta({ name: 'description' }, `${state.app.title} - ${state.title} - ${state.content[0]}`),
  ],
})
