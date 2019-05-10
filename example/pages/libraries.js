const page = state => [
  h1(state.title),

  h3({ id: 'require' }, 'require'),

  h4({ id: 'require-assets' }, 'require in /assets/lib/index.js'),
  p(
    'if /assets/lib/index.js or /assets/lib.js exist, whatever those files export will be merged into LIB.',
  ),
  Pre(`
// /assets/lib/index.js or /assets/lib.js
module.exports = {
  JSON: '@magic-libraries/json',
  // ./localLib resolves to /assets/lib/localLib.js
  localLib: require.resolve('./localLib'),
}`),

  h4({ id: 'require-app' }, 'require in /app.js'),
  p('if /assets/app.js exports a lib key, app.lib will be merged into LIB'),
  Pre(`
// /app.js
module.exports = {
  // ... other app variables (state, actions, View etc)
  lib: {
    JSON: '@magic-modules/json',
    localLib: require.resolve('./assets/lib/localLib'),
  },
}`),

  h4({ id: 'require-page' }, 'require in pages or Modules'),
  p('if a page or Module exports a lib key, it will be merged into LIB'),
  Pre(`
// /pages/index.js
module.exports = {
  // ... other page variables (state, actions, View etc)
  lib: {
    JSON: '@magic-modules/json',
    localLib: require.resolve('./assets/lib/localLib'),
  },
}`),

  h3({ id: 'example' }, 'example'),
  p(['first import the library, see ', Link({ to: '/libraries/#require' }, 'require')]),

  Pre("div(['LIB.test output: ', LIB.test('magic')])"),
  p('renders'),
  div([h4('LIB.test output: '), LIB.test('magic')]),

  div([h4('LIB.exportsTesting.testing output: '), LIB.exportsTesting.testing()]),

  h4({ id: 'caveat' }, 'caveat'),
  p([
    'all libs must either export a single object using module.exports OR using exports.key mappings. one OR the other.',
    ' when using exports.key to export, you will always get an object in LIB.',
    ' when using module.exports, structuring the LIB[name] object is up to you.',
  ]),

  LibraryList,
]

page.state = {
  title: '@magic/core library docs',
  description: '@magic/core libraries allow you to include client side functionality in your app.',
}

module.exports = page
