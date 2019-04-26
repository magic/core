module.exports = {
  state: {
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
            to: '/concepts/#state',
            text: 'state',
            items: [{ to: '/concepts/#state-example', text: 'example state' }],
          },
          {
            to: '/concepts/#actions',
            text: 'actions',
            items: [{ to: '/concepts/#actions-example', text: 'example actions' }],
          },
          {
            to: '/concepts/#views',
            text: 'views',
            items: [{ to: '/concepts/#views-example', text: 'example view' }],
          },
          {
            to: '/concepts/#styles',
            text: 'styles',
            items: [
              { to: '/concepts/#styles-example', text: 'example styles' },
              { to: '/concepts/#styles-magic-css', text: '@magic/css' },
            ],
          },
          {
            to: '/concepts/#globals',
            text: 'global',
            items: [{ to: '/concepts/#globals-example', text: 'example global' }],
          },
          {
            to: '/concepts/#lambdas',
            text: 'server lambdas',
            items: [
              { to: '/concepts/#lambdas-example', text: 'single lambda' },
              { to: '/concepts/#lambdas-example-multi', text: 'multiple lambdas' },
            ],
          },
          {
            to: '/concepts/#libs',
            text: 'external libs',
            items: [
              { to: '/concepts/#libs-dir-or-file', text: 'lib dir or file' },
              { to: '/concepts/#libs-example-file', text: 'example lib file' },
              { to: '/concepts/#libs-app', text: 'app.lib' },
              { to: '/concepts/#libs-module', text: 'module.lib' },
            ],
          },
          { to: '/concepts/#full-example', text: 'full example' },
        ],
      },
      {
        to: '/files/',
        text: 'files & directories',
        items: [
          { to: '/files/#pages', text: 'pages' },
          { to: '/files/#assets', text: 'assets' },
          { to: '/files/#static', text: 'static' },
          { to: '/files/#themes', text: 'themes' },
          { to: '/files/#app', text: 'app' },
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
