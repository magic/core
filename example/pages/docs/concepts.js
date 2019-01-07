module.exports = {
  Body: () => {
    const component = {
      state: `
// state variables can be anything you can JSON.stringify()
state: {
  variable: true,
  args: 'none',
}`,
      actions: `
// actions are an object containing functions.
// if an action returns an object, this object gets merged into the state
actions: {
  changeVariable: args => state => ({
    variable: !state.variable,
    args,
  }),
  callActionInAction: () => async (state, actions) => {
    // just await something inside an action to create an async action
    await new Promise(resolve => {
      setTimeout(resolve, 200)
    })

    // actions can call other actions
    actions.changeVariable(state.variable ? 'arg passed to function' : '')
  },
}`,
      global: `
global: {
  state: {
    variable: true,
    args: true,
  },
  actions: {
    callActionInAction: true,
    changeVariable: true,
  },
}`,
      view: `
View: (state, actions) => (
  div({ onclick: actions.callActionInAction }, state.variable)
)`,
      style: `
style: {
  '.className': {
    color: 'green',

    // expands to .className:hover because of the &
    '&:hover': {
      color: 'orange',
    },

    // expands to .className .childClass
    '.childClass': {
      color: 'blue',
    },
  },
  // css ids
  '#id': {
    color: 'yellow',
  },
  // default html tag styles
  div: {
    color: 'black',
  },
}`,
    }

    const indent = str =>
      str
        .split('\n')
        .map(s => `  ${s}`)
        .join('\n')

    const combined = `
const component = {
  ${indent(component.state)},
  ${indent(component.actions)},
  ${indent(component.style)},
  ${indent(component.view)},
  ${indent(component.global)},
}`

    return [
      DocHeader,

      h1('concepts'),
      div([
        div([
          h2('components'),
          p('components are the main building block of magic.'),
          p('components can include state, actions, style and multiple Views'),
        ]),

        div([
          h2('state'),
          div([
            p('state is a javascript object.'),
            p('state can be mutated by actions.'),
            p('every rendering step, the state determines the output of the view'),
            h4('example state:'),
            Pre.View(component.state),
          ]),
        ]),

        div([
          h2('actions'),
          p('actions are an object of functions'),
          p('those functions get passed a state object and return a new partial state'),
          h4('example functions'),
          Pre.View(component.actions),
        ]),

        div([
          h2('views'),
          p('views render the state to html'),
          p(
            'whenever an action triggers a statechange, this statechange then triggers a view change.',
          ),
          Pre.View(component.view),
        ]),

        div([
          h2('styles'),
          p('every component can have a style object attached to it.'),
          p('magic will automagically merge all styles into one global css file.'),
          p('in the future, it will also remove unused styles for you.'),
          Pre.View(component.style),
        ]),

        div([
          h2('global'),
          p('every component can set a global object, containing state and action properties.'),
          Pre.View(component.global),
        ]),

        div([
          h2('Full component'),
          p('If we assemble those pieces, we get the following:'),
          Pre.View(combined),
        ]),
      ]),
    ]
  },
}
