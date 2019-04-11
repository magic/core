const Mod = {
  View: state =>
    div({ class: 'Mod View' }, [
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
    div({ class: 'Mod Component' }, [
      h3('Mod.Component'),
      p([
        'Mod.Component, a second component in ',
        Link({ to: 'https://github.com/magic/core/example/assets/module.js' }, '/assets/module.js'),
      ]),
    ]),

  state: {
    module: {
      test: 'testing',
    },
  },

  style: {
    '.Mod': {
      margin: '0 0 1em',
      padding: '0.5em',
      border: '1px solid',

      h3: {
        margin: 0,
      },

      '&.View': {
        borderColor: 'green',
      },
      '&.Component': {
        borderColor: 'red',
      },
    },
  },

  global: {
    state: {
      module: true,
    },
  },
}

module.exports = Mod
