module.exports = {
  state: {
    title: '@magic/core docs',
    description: '@magic/core documentation directory.',
    docMenu: [
      { to: '/docs/concepts/', text: 'concepts' },
      { to: '/docs/files/', text: 'files & directories' },
      { to: '/docs/modules/', text: 'modules' },
      { to: '/docs/themes/', text: 'themes' },
    ],
  },

  Body: (state, actions) => [
    h1(state.title),
    div([
      p('Welcome to the magic docs.'),
      p('The goal of this document is to give you a rough @magical overview.'),
    ]),
    h3('Contents:'),
    Menu.View({ name: 'docMenu' }),
  ],
}
