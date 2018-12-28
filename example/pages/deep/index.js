module.exports = ({ p, meta, h1, div, title }) => ({
  state: {
    title: 'h1 deep/index',
    content: ['div deep/index'],
    htmlTitle: 'testing the html title tag',
  },

  actions: {
    deepAction: state => ({ test: !state.test }),
  },

  Body: state => [h1(state.title), div(state.content.map(p))],
  Head: state => title(state.htmlTitle),
})
