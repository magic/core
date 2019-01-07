module.exports = {
  state: {
    title: '@magic-modules',
    description: '@magic-modules docs.',
  },

  Body: state => [
    DocHeader,

    h1(state.title),
    p('magic modules are predefined components for webapps.'),
    h3('list of magic modules'),
    ul([li([Link({ to: 'https://github.com/magic-modules/pre' }, '@magic-modules/pre')])]),
  ],
}
