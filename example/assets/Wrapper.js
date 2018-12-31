const Inside = require('./Inside')

module.exports = {
  state: {
    wrapperStateVar: false,
  },

  actions: {
    wrapperAction: () => state => console.log('wrapperAction') || ({ wrapperStateVar: !state.wrapperStateVar }),
  },

  View: (state, actions) =>
    div({ 
      class: `Wrapper${state.wrapperStateVar ? ' Test' : ''}`, 
      onclick: actions.wrapperAction,
    }, Inside(state, actions)),

  style: {
    '.Wrapper': {
      color: 'orange',
    
      '&.Test': {
        color: 'green',
      },
    },
  },
}
