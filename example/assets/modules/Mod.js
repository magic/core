const Mod = state =>
  div({ class: 'Mod' }, [
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
  margin: '0 0 1em',
  padding: '0.5em',
  border: '1px solid',
  borderColor: 'green',

  h3: {
    margin: 0,
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

  return div({ class: 'ModComponent' }, [
    header && h5(header),
    p([
      'Mod.Component, a second component in ',
      Link({ to: 'https://github.com/magic/core/example/assets/module.js' }, '/assets/module.js'),
    ]),
  ])
}

Mod.Component.lib = {
  ModComponentTest: require.resolve('../lib/module-exports.js'),
}

Mod.Component.style = {
  borderColor: 'orange',
}

Mod.Component.props = [{ key: 'header', type: ['string', 'array'], required: ['title'] }]

module.exports = Mod
