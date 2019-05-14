import path from 'path'

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
        { to: '#philosophy', text: 'philosophy' },
        { to: '/concepts/#modules', text: 'modules' },
        {
          to: '#state',
          text: 'state',
          items: [{ to: '-example', text: 'example state' }],
        },
        {
          to: '#actions',
          text: 'actions',
          items: [{ to: '-example', text: 'example actions' }],
        },
        {
          to: '#views',
          text: 'views',
          items: [{ to: '-example', text: 'example view' }],
        },
        {
          to: '#styles',
          text: 'styles',
          items: [
            { to: '-example', text: 'example styles' },
            { to: '-magic-css', text: '@magic/css' },
          ],
        },
        {
          to: '#globals',
          text: 'global',
          items: [{ to: '-example', text: 'example global' }],
        },
        {
          to: '#lambdas',
          text: 'server lambdas',
          items: [
            { to: '-example', text: 'single lambda' },
            { to: '-example-multi', text: 'multiple lambdas' },
          ],
        },
        {
          to: '#libs',
          text: 'external libs',
          items: [
            { to: '-dir-or-file', text: 'lib dir or file' },
            { to: '-example-file', text: 'example lib file' },
            { to: '-app', text: 'app.lib' },
            { to: '-module', text: 'module.lib' },
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
      items: [
        { to: '#require', text: 'require from' },
        { to: '#require-assets', text: '/assets/lib.js' },
        { to: '#require-app', text: '/app.js' },
        { to: '#require-page', text: 'modules / pages' },
        { to: '#example', text: 'example' },
        { to: '#caveat', text: 'caveat' },
        { to: '#gl-magic-libraries', text: '@magic-libraries' },
      ],
    },
  ],
  logo: '/logo.png',
  logotext: '@magic',
}

const dirName = path.dirname(new URL(import.meta.url).pathname)

export const lib = {
  test: path.join(dirName, 'assets', 'lib', 'module-exports.js'),
}

export default {
  lib,
  state,
}
