module.exports = {
  Body: () => {
    const component = {
      state: `
state: {
  variable: true,
  args: 'none',
}`,
      actions: `
actions: {
  changeVariable: args => ({ variable: !state.variable, args }),
  callActionInAction: () => (state, actions) => {
    let args = 'arg passed to function'
    if (!state.variable) {
      args = ''
    }
    actions.changeVariable(args)
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
      h1('concepts'),
      div([
        div([
          h3('components'),
          p('components are the main building block of magic.'),
          p('components can include state, actions, style and multiple Views'),
        ]),

        div([
          h3('state'),
          div([
            p('state is a javascript object.'),
            p('state can be mutated by actions.'),
            p('every rendering step, the state determines the output of the view'),
            h4('example state:'),
            Pre.View(component.state),
          ]),
        ]),

        div([
          h3('actions'),
          p('actions are an object of functions'),
          p('those functions get passed a state object and return a new partial state'),
          h4('example functions'),
          Pre.View(component.actions),
        ]),

        div([
          h3('views'),
          p('views render the state to html'),
          p(
            'whenever an action triggers a statechange, this statechange then triggers a view change.',
          ),
          Pre.View(component.view),
        ]),

        div([
          h3('styles'),
          p('every component can have a style object attached to it.'),
          p('magic will automagically merge all styles into one global css file.'),
          p('in the future, it will also remove unused styles for you.'),
          Pre.View(component.style),
        ]),

        div([
          h3('global'),
          p('every component can set a global object, containing state and action properties.'),
          Pre.View(component.global),
        ]),

        div([
          h3('Full component'),
          p('If we assemble those pieces, we get the following:'),
          Pre.View(combined),
        ]),
      ]),
    ]
  },
}
