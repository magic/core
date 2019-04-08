const Mod = {
  View: (props, children) => (state, actions) =>
    div([
      h3('Mod.View'),
      p([
        'this is Mod.View. it gets loaded from ',
        Link({ to: 'https://github.com/magic/core/example/assets/module.js' }, '/assets/module.js'),
      ]),
      p([
        'and imported in ',
        Link({ to: 'https://github.com/magic/core/example/assets/index.js' }, '/assets/index.js'),
      ]),
      p(['the state of this module: ', JSON.stringify(state.module)]),
    ]),
  Component: () =>
    div([h3('Mod.Component'), p('Mod.Component, a second component in /assets/module.js')]),

  state: {
    module: {
      test: 'testing',
    },
  },

  global: {
    state: {
      module: true,
    },
  },
}

module.exports = Mod
