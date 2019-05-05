const Mod = state =>
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
  ])

Mod.state = {
  module: {
    test: 'testing',
  },
}

Mod.style = {
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
}

Mod.global = {
  state: {
    module: true,
  },
}

Mod.Component = props => () => {
  props = typeof props === 'string' ? { header: props } : props
  CHECK_PROPS(props, Mod.Component.props, 'Mod.Component')
  const header = props.header || props.title

  return div({ class: 'Mod Component' }, [
    header && h3(header),
    p([
      'Mod.Component, a second component in ',
      Link({ to: 'https://github.com/magic/core/example/assets/module.js' }, '/assets/module.js'),
    ]),
  ])
}

Mod.Component.props = [{ key: 'header', type: ['string', 'array'], required: ['title'] }]

module.exports = Mod
