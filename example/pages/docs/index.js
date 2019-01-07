module.exports = {
  state: {
    title: '@magic/core docs',
    description: '@magic/core documentation directory.',
  },

  Body: state => [
    DocHeader,

    h1(state.title),
    div([
      p('Welcome to the magic docs.'),
      p('The goal of this document is to give you a rough @magical overview.'),
    ]),
  ],
}
