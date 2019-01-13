module.exports = {
  state: {
    title: '@magic-themes',
    description: '@magic-theme docs.',
  },

  View: state => [
    DocHeader,

    h1(state.title),
    p(
      'magic themes are themes for magic apps. you decide which theme to load by specifying the theme name in config.THEME',
    ),
    Pre.View(`
// /config.js
module.exports = {
  // ...rest of config,
  THEME: 'blue',
}
`),

    h2('theme load order'),
    p('themes get loaded from multiple places. last in the list overwrites earlier entries.'),
    p('/node_modules/@magic/core/src/themes/${config.THEME}/index.js'),
    p('/node_modules/@magic-themes/${config.THEME}'),
    p('/assets/themes/${config.THEME}/index.js'),

    h2('list of magic themes'),
    ul([li([Link({ to: 'https://github.com/magic-themes' }, 'none yet, coming soon.')])]),
  ],
}
