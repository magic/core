module.exports = {
  state: {
    title: '@magic-themes',
    description: '@magic-theme docs.',
  },

  Body: state => [
    DocHeader.View,

    h1(state.title),
    p('magic themes are themes for magic apps.'),
    h3('list of magic themes'),
    ul([
      li([
        a(
          { href: 'https://github.com/magic-themes/blue', target: '_blank', rel: 'noopener' },
          '@magic-themes/blue',
        ),
      ]),
    ]),
  ],
}
