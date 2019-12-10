export const state = config => ({
  seo: {
    name: '@magic/core documentation',
    url: `https://${config.URL}`,
    // about: '@magic/core javascript library',
    image: `${config.WEB_ROOT}logo.png`,
    author: {
      '@type': 'person',
      name: 'Jascha Ehrenreich',
      jobTitle: 'Technomancer',
      image: 'https:/jaeh.at/img/jascha.ehrenreich.jpg',
    },
  },

  menu: [
    {
      to: '/concepts/',
      text: 'concepts',
      items: [
        { to: '#modules', text: 'modules' },
        { to: '#state', text: 'state' },
        { to: '#actions', text: 'actions' },
        { to: '#views', text: 'views' },
        { to: '#styles', text: 'styles' },
        { to: '#globals', text: 'global' },
        { to: '#lambdas', text: 'server lambdas' },
        { to: '#libs', text: 'external libs' },
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
          text: '/assets/app.mjs',
          items: [{ to: '-example', text: 'example' }],
        },
        {
          to: '#config',
          text: '/config.mjs',
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
        { to: '#gl-magic-modules', text: '@magic-modules' },
        { to: '/example/', text: 'custom modules' },
        {
          to: '/preinstalled/',
          text: 'preinstalled',
          items: [
            {
              to: '#menu',
              text: 'menu',
              items: [
                { to: '-props', text: 'props' },
                { to: '-sub-menus', text: 'sub menus' },
              ],
            },
            { to: '#link', text: 'link' },
            { to: '#img', text: 'img' },
            { to: '#footer', text: 'footer' },
            { to: '#gdpr', text: 'gdpr' },
          ],
        },
        {
          to: '/markdown/',
          text: 'markdown',
        },
        {
          to: '/html/',
          text: 'html',
        },
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
})
