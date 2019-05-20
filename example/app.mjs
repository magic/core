export const state = {
  app: {
    title: 'Custom App Title',
    description: 'Custom App Description',
  },
  menu: [
    {
      to: '/concepts/',
      text: 'concepts',
      items: [
        { to: '/concepts/#modules', text: 'modules' },
        {
          to: '#state',
          text: 'state',
        },
        {
          to: '#actions',
          text: 'actions',
        },
        {
          to: '#views',
          text: 'views',
        },
        {
          to: '#styles',
          text: 'styles',
        },
        {
          to: '#globals',
          text: 'global',
        },
        {
          to: '#lambdas',
          text: 'server lambdas',
        },
        {
          to: '#libs',
          text: 'external libs',
        },
      ],
    },
    {
      to: '/files/',
      text: 'files & directories',
      items: [
        {
          to: '#pages',
          text: '/pages',
          items: [
            { to: '-dir-structure', text: 'url mapping' },
            { to: '-example', text: 'example' },
          ],
        },
        {
          to: '#assets',
          text: '/assets',
          items: [{ to: '-example', text: 'example' }],
        },
        { to: '/files/#static', text: '/assets/static' },
        {
          to: '#themes',
          text: '/assets/themes',
          items: [{ to: '-example', text: 'example' }],
        },
        {
          to: '#app',
          text: '/assets/app.js',
          items: [{ to: '-example', text: 'example' }],
        },
        {
          to: '#config',
          text: '/config.js',
          items: [{ to: '-example', text: 'example' }],
        },
        {
          to: '#menu',
          text: '/assets/Menu.js',
          items: [{ to: '-example', text: 'example' }],
        },
      ],
    },
    {
      to: '/modules/',
      text: 'modules',
      items: [
        { to: '#definition', text: 'definition' },
        { to: '#usage', text: 'usage' },
        { to: '#custom-module', text: 'custom modules' },
        { to: '#preinstalled', text: 'preinstalled' },
        {
          to: '#menu',
          text: 'menu',
          items: [{ to: '-props', text: 'props' }, { to: '-sub-menus', text: 'sub menus' }],
        },
        { to: '#link', text: 'link' },
        { to: '#footer', text: 'footer' },
        { to: '#gl-magic-modules', text: '@magic-modules' },
      ],
    },
    {
      to: '/themes/',
      text: 'themes',
      items: [{ to: '#gl-magic-themes', text: '@magic-themes' }],
    },
    {
      to: '/libraries/',
      text: 'libraries',
      items: [{ to: '#gl-magic-libraries', text: '@magic-libraries' }],
    },
  ],
  logo: '/logo.png',
  logotext: '@magic',
}
