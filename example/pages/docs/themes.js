module.exports = {
  state: {
    title: '@magic-themes',
    description: '@magic-theme docs.',
  },

  Body: state => [
    DocHeader,

    h1(state.title),
    p('magic themes are themes for magic apps.'),

    h2('list of magic themes'),
    ul([li([Link({ to: 'https://github.com/magic-themes/blue' }, '@magic-themes/blue')])]),
  ],
}
