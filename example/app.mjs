import fs from '@magic/fs'
import path from 'path'

export const state = config => ({
  seo: {
    name: '@magic/core documentation',
    url: `https://${config.URL}`,
    about: '@magic framework core.',
    image: `https://${config.URL}${config.WEB_ROOT}logo.png`,
    author: {
      '@type': 'person',
      name: 'Jascha Ehrenreich',
      jobTitle: 'Technomancer',
      image: 'https:/jaeh.at/img/jascha.ehrenreich.jpg',
      url: 'https://jaeh.at',
    },
  },

  title: '@magic/core documentation',

  description: [
    '@magic/core documentation.',
    'tells you why, how and when to use @magic.',
    'also provides an overview of all @magic functionality this ecosystem provides.',
  ],

  logo: '/magic.png',
  logotext: '@magic',

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
        { to: '#static', text: '/assets/static' },
        {
          to: '#themes',
          text: '/assets/themes',
          items: [{ to: '-example', text: 'example' }],
        },
        {
          to: '#app',
          text: 'app.mjs',
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
        { to: '/modules/example/', text: 'custom modules' },
        {
          to: '/modules/preinstalled/',
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
          ],
        },
        {
          to: '/modules/markdown/',
          text: 'markdown',
        },
        {
          to: '/modules/html/',
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
      items: [
        { to: '#abstract', text: 'summary' },
        { to: '#dir-or-file', text: 'local file' },
        { to: '#npm', text: 'libs from npm' },
        { to: '#example', text: 'example' },
        { to: '#gl-magic-libraries', text: '@magic-libraries' },
      ],
    },
    { to: '/news/', text: 'news' },
  ],
})

// export const server = {
//   lambda1: () => ({
//     code: 200,
//     body: 'Ok, lambda1',
//   }),
//   lambda2: () => ({
//     code: 200,
//     body: 'Ok, lambda2',
//   }),
// }

export const build = async ({ app, config }) => {
  const dataPath = path.join(config.DIR.ASSETS, 'data', 'index.json')
  const buildData = await fs.readFile(dataPath)
  const json = JSON.parse(buildData)

  // add the json data to the state.
  app.state.data = json.data

  app.pages = app.pages || []

  // this adds the /build/ page to this app
  app.pages.push({
    View: state =>
      div([
        h3(state.title),
        p(state.description),
        p([h4('state.data'), Pre(JSON.stringify({ data: state.data }, null, 2))]),
      ]),
    name: `${config.WEB_ROOT}build/`,
    path: `${config.WEB_ROOT}build/index.html`,
    state: json.data,
  })

  return app
}
