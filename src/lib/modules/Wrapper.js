const { div } = require('./tags')
const Inside = require('./Inside')

const Wrapper = (state, actions) => div({ class: 'Wrapper' }, Inside(state, actions))

Wrapper.state = {
  test: false,
}

Wrapper.actions = {
  wrapperAction: state => ({ test: !state.test }),
}

Wrapper.style = {
  '.Wrapper': {
    color: 'orange',
  },
}

module.exports = Wrapper
