module.exports = {
  Body: () => [
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
          Pre.View(`
const state = {
  variable: true,
  args: '',
}`),
        ]),
      ]),

      div([
        h3('actions'),
        p('actions are an object of functions'),
        p('those functions get passed a state object and return a new partial state'),
        h4('example functions'),
        Pre.View(`
const actions = {
  changeVariable: args => ({ variable: !state.variable, args }),
  callActionInAction: () => (state, actions) => {
    let args = 'arg passed to function'
    if (!state.variable) {
      args = ''
    }
    actions.changeVariable(args)
  },
}`),
      ]),

      div([
        h3('views'),
        p('views render the state to html'),
        p(
          'whenever an action triggers a statechange, this statechange then triggers a view change.',
        ),
        Pre.View(`
const view = (state, actions) => (
  div({ onclick: actions.callActionInAction }, state.variable)

        `),
      ]),
    ]),
  ],
}
