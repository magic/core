export const View = state =>
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

export const state = {
  module: {
    test: 'testing',
  },
}

export const style = {
  margin: '0 0 1em',
  padding: '0.5em',
  border: '1px solid',
  borderColor: 'green',

  h3: {
    margin: 0,
  },
}

export const global = {
  state: {
    module: true,
  },
}

export const Component = props => () => {
  props = typeof props === 'string' ? { header: props } : props
  CHECK_PROPS(props, Mod.Component.props, 'Mod.Component')
  const header = props.header || props.title

  return div({ class: 'ModComponent' }, [
    header && h5(header),
    p([
      'Mod.Component, a second component in ',
      Link({ to: 'https://github.com/magic/core/example/assets/module.mjs' }, '/assets/module.mjs'),
    ]),
  ])
}

Component.style = {
  border: '1px solid orange',
}

Component.props = [{ key: 'header', type: ['string', 'array'], required: ['title'] }]

export default {
  View,
  state,
  style,
  global,
  Component,
}
