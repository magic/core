module.exports = {
  state: {
    app: {
      title: 'Custom App Title',
      description: 'Custom App Description',
    },
    menu: [
      { to: '/', text: 'home' },
      { to: '/deep/', text: 'deep' },
      { to: '/docs/', text: 'docs' },
    ],
    docMenu: [
      { to: '/docs/concepts/', text: 'concepts' },
      { to: '/docs/files/', text: 'files & directories' },
      { to: '/docs/modules/', text: 'modules' },
      { to: '/docs/themes/', text: 'themes' },
      { to: '/docs/dependencies/', text: 'dependencies' },
    ],
    logo: '/logo.png',
  },
}
