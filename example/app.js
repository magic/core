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
          { to: '#philosophy', text: 'philosophy' },
          { to: '/concepts/#modules', text: 'modules' },
          {
            to: '#state',
            text: 'state',
            items: [{ to: '/concepts/#state-example', text: 'example state' }],
          },
          {
            to: '#actions',
            text: 'actions',
            items: [{ to: '/concepts/#actions-example', text: 'example actions' }],
          },
          {
            to: '#views',
            text: 'views',
            items: [{ to: '/concepts/#views-example', text: 'example view' }],
          },
          {
            to: '#styles',
            text: 'styles',
            items: [
              { to: '/concepts/#styles-example', text: 'example styles' },
              { to: '/concepts/#styles-magic-css', text: '@magic/css' },
            ],
          },
          {
            to: '#globals',
            text: 'global',
            items: [{ to: '/concepts/#globals-example', text: 'example global' }],
          },
          {
            to: '#lambdas',
            text: 'server lambdas',
            items: [
              { to: '/concepts/#lambdas-example', text: 'single lambda' },
              { to: '/concepts/#lambdas-example-multi', text: 'multiple lambdas' },
            ],
          },
          {
            to: '#libs',
            text: 'external libs',
            items: [
              { to: '/concepts/#libs-dir-or-file', text: 'lib dir or file' },
              { to: '/concepts/#libs-example-file', text: 'example lib file' },
              { to: '/concepts/#libs-app', text: 'app.lib' },
              { to: '/concepts/#libs-module', text: 'module.lib' },
            ],
          },
          { to: '/concepts/#full-example', text: 'example' },
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
              { to: '/files/#pages-dir-structure', text: 'url mapping' },
              { to: '/files/#pages-example', text: 'example' },
            ],
          },
          {
            to: '#assets',
            text: '/assets',
            items: [{ to: '/files/#assets-example', text: 'example' }],
          },
          { to: '/files/#static', text: '/assets/static' },
          {
            to: '#themes',
            text: '/assets/themes',
            items: [{ to: '/files/#themes-example', text: 'example' }],
          },
          {
            to: '#app',
            text: '/assets/app.js',
            items: [{ to: '/files/#app-example', text: 'example' }],
          },
          {
            to: '#config',
            text: '/config.js',
            items: [{ to: '/files/#config-example', text: 'example' }],
          },
          {
            to: '#menu',
            text: '/assets/Menu.js',
            items: [{ to: '/files/#menu-example', text: 'example' }],
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
            to: '/modules/#menu',
            text: 'menu',
            items: [
              { to: '-props', text: 'props' },
              { to: '-sub-menus', text: 'sub menus' },
            ],
          },
          { to: '#link', text: 'link' },
          { to: '#footer', text: 'footer' },
          { to: '#magic-modules-list', text: '@magic-modules' },
        ],
      },
      {
        to: '/themes/',
        text: 'themes',
        items: [{ to: '#magic-themes-list', text: '@magic-themes' }],
      },
      {
        to: '/libraries/',
        text: 'libraries',
        items: [
          { to: '#require', text: 'require from' },
          { to: '#require-assets', text: '/assets/lib.js' },
          { to: '#require-app', text: '/app.js' },
          { to: '#require-page', text: 'modules / pages' },
          { to: '#example', text: 'example' },
          { to: '#caveat', text: 'caveat' },
          { to: '#magic-libraries-list', text: '@magic-libraries' },
        ],
      },
    ],
    logo: '/logo.png',
    logotext: '@magic',
  },

  lib: {
    test: require.resolve('./assets/lib/module-exports.js'),
  },
}
