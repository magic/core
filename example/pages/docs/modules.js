module.exports = {
  state: {
    title: '@magic-modules',
    description: '@magic-modules module docs.',
  },

  Body: state => [
    h1(state.title),
    p('magic modules are predefined components for webapps.'),
    h3('list of magic modules'),
    ul([
      li([
        a(
          { href: 'https://github.com/magic-modules/pre', target: '_blank', rel: 'noopener' },
          '@magic-modules/pre',
        ),
      ]),
    ]),
  ],
}
