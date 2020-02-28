---
@state {
  "title": "@magic-modules/example",
  "description": "@magic-modules example module."
}
---

# ${state.title}

<h2 id='custom-module'>Mod and Component:</h2>

<Mod state></Mod>

<Component title='Mod Component Title, passed via props'></Component>

### Mod sourcecode:

<Pre>
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
</Pre>

### Component sourcecode:

<Pre>
export const View = props => {
  props = typeof props === 'string' ? { header: props } : props
  CHECK_PROPS(props, propTypes, 'Component')
  const header = props.header || props.title

  return div({ class: 'Component' }, \\[
    header && h5(header),
    p([
      'Component, a second component in ',
      Link(
        { to: 'https://github.com/magic/core/blob/master/example/assets/modules/Component.mjs' },
        '/assets/modules/Component.mjs',
      ),
    ]),
  ])
}

export const style = {
  border: '1px solid orange',
}

export const propTypes = {
  Component: [{ key: 'header', type: ['string', 'array'], required: ['title'] }],
}
</Pre>
