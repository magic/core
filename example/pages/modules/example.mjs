export const state = {
  title: '@magic-modules/example',
  description: '@magic-modules example module.',
}

export const View = state => [
  h1('example module'),

  h2({ id: 'custom-module' }, 'Mod and Mod.Component:'),

  Mod(state),

  Mod.Component({ title: 'Mod Component Title, passed via props' }),

  h3('Mod sourcecode:'),

  Pre(`
  export const View = state =>
  div({ class: 'Mod' }, [
    h3('Mod.Mod'),
    p([
      'this is Mod. it gets loaded from ',
      Link({ to: 'https://github.com/magic/core/blob/master/example/assets/modules/Mod.mjs' }, '/assets/modules/Mod.mjs'),
      ' automatically, no need to import it.',
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

export const Component = props => {
  props = typeof props === 'string' ? { header: props } : props
  CHECK_PROPS(props, propTypes, 'ModComponent')
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

export const propTypes = {
  ModComponent: [{ key: 'header', type: ['string', 'array'], required: ['title'] }],
}
`),
]
