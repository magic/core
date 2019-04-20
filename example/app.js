module.exports = {
  state: {
    app: {
      title: 'Custom App Title',
      description: 'Custom App Description',
    },
    menu: [
      { to: '/concepts/', text: 'concepts' },
      {
        to: '/files/',
        text: 'files & directories',
        items: [
          { to: '/files/#pages', text: 'pages' },
          { to: '/files/#assets', text: 'assets' },
          { to: '/files/#static', text: 'static' },
          { to: '/files/#themes', text: 'themes' },
          { to: '/files/#config', text: 'config.js' },
        ],
      },
      { to: '/modules/', text: 'modules' },
      { to: '/themes/', text: 'themes' },
    ],
    logo: '/logo.png',
    logotext: '@magic',
  },
}
