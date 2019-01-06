const Inside = require('./Inside')

module.exports = {
  state: {
    wrapperStateVar: false,
    buttonText: 'click me!',
  },

  actions: {
    wrapperAction: () => state => ({ wrapperStateVar: !state.wrapperStateVar }),
  },

  View: (state, actions) =>
    div(
      {
        class: `Wrapper${state.wrapperStateVar ? ' Test' : ''}`,
      },
      [Inside(state, actions), button({ onclick: actions.wrapperAction }, state.buttonText)],
    ),

  style: {
    '.Wrapper': {
      color: 'orange',

      '&.Test': {
        color: 'green',
      },
    },
  },
}
