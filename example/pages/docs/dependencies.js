module.exports = {
  state: {
    title: '@magic/core dependencies',
    description: '@magic/core app dependency information.',
  },

  View: state => [
    DocHeader,

    h1('dependencies'),
    p('this is a list of all magic dependencies.'),

    h2('production'),
    p('those dependencies get included into your magic app production client bundle.'),
    ul([
      li([
        h4('hyperapp, ~1kb.'),
        Link({ to: 'https://github.com/jorgebucaran/hyperapp' }, 'hyperapp@1.2.9'),
      ]),
    ]),

    h2('development'),
    ul([
      li('@babel/core: 7.2.2'),
      li('@babel/plugin-transform-arrow-functions: 7.2.0'),
      li('@babel/preset-env: 7.2.3,'),
      li('@magic-modules/pre: github:magic-modules/pre,'),
      li('@magic/css: github:magic/css,'),
      li('@magic/deep: 0.0.1,'),
      li('@magic/log: 0.0.2,'),
      li('@magic/types: 0.0.2,'),
      li('babel-plugin-minify-dead-code-elimination: 0.5.0,'),
      li('babel-plugin-minify-mangle-names: 0.5.0,'),
      li('hyperapp-render: 3.0.0,'),
      li('imagemin: 6.1.0,'),
      li('imagemin-jpegtran: 6.0.0,'),
      li('imagemin-pngquant: 6.0.1,'),
      li('imagemin-svgo: 7.0.0,'),
      li('node-zopfli-es: 1.0.0'),
    ]),
  ],
}
