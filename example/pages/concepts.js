module.exports = {
  state: {
    title: '@magic/core concepts',
    description: '@magic/core conceptual information.',
  },

  View: state => {
    const example = {
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
const exampleModule = {
  ${indent(example.state)},
  ${indent(example.actions)},
  ${indent(example.style)},
  ${indent(example.view)},
  ${indent(example.global)},
}`

    return [
      h1(state.title),
      p('magic concepts. These are the building blocks of every module in a magic app'),

      div([
        div([
          h2('modules'),
          p('modules are the main building block of magic.'),
          p(
            'modules can include state, actions, style and multiple components (which we call Views).',
          ),
          p(
            'View names have to start with an uppercased character. Every module can export multiple components that share state, actions and styles.',
          ),
        ]),

        div([
          h2('state'),
          div([
            p('state is a javascript object.'),
            p('state can be mutated by actions.'),
            p('every rendering step, the state determines the output of the view'),

            h3('example state:'),
            Pre.View(example.state),
          ]),
        ]),

        div([
          h2('actions'),
          p('actions are an object of functions'),
          p('those functions get passed a state object and return a new partial state'),

          h3('example actions'),
          Pre.View(example.actions),
        ]),

        div([
          h2('views'),
          p('views render the state to html'),
          p(
            'whenever an action triggers a statechange, this statechange then triggers a view change.',
          ),

          h3('example view'),
          Pre.View(example.view),
        ]),

        div([
          h2('styles'),
          p('every module can have a style object attached to it.'),
          p('magic will automagically merge all styles into one global css file.'),
          p('in the future, it will also remove unused styles for you.'),

          p('style merge order from lowest to highest:'),
          p('module.style < page.style < app.style < theme.style'),

          h3('example styles'),
          Pre.View(example.style),
        ]),

        div([
          h2('global'),
          p('every module can set a global object, containing state and action properties.'),
          p(
            'every key in the mod.global object that is set to true gets merged into the main app state/actions.',
          ),

          h3('example globals'),
          Pre.View(example.global),
        ]),

        div([
          h2('Full example'),
          p('If we assemble those pieces, we get the following:'),
          Pre.View(combined),
        ]),
      ]),
    ]
  },
}
