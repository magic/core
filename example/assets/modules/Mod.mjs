const Mod = {
  View: state =>
  div({ class: 'Mod' }, [
    h3('Mod.Mod'),
    p([
      'this is Mod. it gets loaded from ',
      Link({ to: 'https://github.com/magic/core/example/assets/module.js' }, '/assets/module.js'),
    ]),
    p([
      'and imported in ',
      Link({ to: 'https://github.com/magic/core/example/assets/index.js' }, '/assets/index.js'),
    ]),
    p(['the state of this module: ', JSON.stringify(state.module)]),
  ])
}

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

Mod.Component = {
  View: props => {
  props = typeof props === 'string' ? { header: props } : props
  CHECK_PROPS(props, Mod.Component.propTypes, 'ModComponent')
  const header = props.header || props.title

  return div({ class: 'ModComponent' }, [
    header && h5(header),
    p([
      'Mod.Component, a second component in ',
      Link({ to: 'https://github.com/magic/core/example/assets/module.mjs' }, '/assets/module.mjs'),
    ]),
  ])
}}

Mod.Component.style = {
  border: '1px solid orange',
}

Mod.Component.propTypes = {
  ModComponent: [{ key: 'header', type: ['string', 'array'], required: ['title'] }],
}

export default Mod