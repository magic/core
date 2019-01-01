const Inside = require('./Inside')

module.exports = {
  state: {
    wrapperStateVar: false,
  },

  actions: {
    wrapperAction: () => state => ({ wrapperStateVar: !state.wrapperStateVar }),
  },

  View: (state, actions) =>
    div(
      {
        class: `Wrapper${state.wrapperStateVar ? ' Test' : ''}`,
      },
      [Inside(state, actions), button({ onclick: actions.wrapperAction }, 'click me')],
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
