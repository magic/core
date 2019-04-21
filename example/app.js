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
      {
        to: '/modules/',
        text: 'modules',
        items: [
          { to: '/modules/#definition', text: 'definition' },
          { to: '/modules/#usage', text: 'usage' },
          { to: '/modules/#custom-module', text: 'custom modules' },
          { to: '/modules/#preinstalled', text: 'preinstalled' },
          { to: '/modules/#menu', text: 'menu' },
          { to: '/modules/#link', text: 'link' },
          { to: '/modules/#footer', text: 'footer' },
          { to: '/modules/#magic-modules', text: '@magic-modules' },
        ],
      },
      { to: '/themes/', text: 'themes' },
    ],
    logo: '/logo.png',
    logotext: '@magic',
  },
}
