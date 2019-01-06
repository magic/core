module.exports = {
  state: {
    count: 0,
  },
  actions: {
    count: mod => state => ({ count: state.count + mod }),
  },

  View: (state, actions) =>
    div([
      h1('Counter'),
      div(`count: ${state.count}`),
      div("this counter globally shares it's state with all other counters"),
      button({ onclick: () => actions.count(1) }, '+1'),
      button({ onclick: () => actions.count(10) }, '+10'),
      button({ onclick: () => actions.count(-1) }, '-1'),
      button({ onclick: () => actions.count(-10) }, '-10'),
    ]),

  global: {
    state: {
      count: true,
    },
    actions: {
      count: true,
    },
  },
}
