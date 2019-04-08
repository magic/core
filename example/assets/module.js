const Mod = {
  View: (state, actions) => div([
    p([
      'this is Mod.View. it gets loaded via ',
      Link({ to: 'https://github.com/magic/core/example/assets/module.js' }, '/assets/module.js'),
      'the state of this module: ',
      JSON.stringify(state.module),
    ]),
  Component: () => div('Mod.Component, a second component in /assets/module.js'),
}

Mod.state = {
  module: {
    test: 'testing',
  },
}

module.exports = Mod