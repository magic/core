export const runBabel = config => {
  const { IS_PROD, IS_DEV, CLIENT_LIB_NAME } = config

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: '>0.25%, not dead',
        forceAllTransforms: true,
        ignoreBrowserslistConfig: true,
        // modules: false,
        debug: IS_DEV,
      },
    ],
  ]

  const plugins = [
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-proposal-object-rest-spread',
    ['@babel/plugin-transform-react-jsx', { pragma: 'h' }],
    '@babel/plugin-proposal-export-namespace-from',
  ]

  plugins.push([
    'remove-code',
    {
      function: ['CHECK_PROPS'],
    },
  ])

  if (IS_PROD) {
    const minify = !process.argv.includes('--no-minify')
    if (minify) {
      presets.push('minify')
    }
  }

  return {
    filename: `${CLIENT_LIB_NAME}.js`,
    minified: IS_PROD,
    comments: IS_DEV,
    configFile: false,
    sourceMaps: false,
    presets: IS_PROD ? presets : [],
    plugins,
  }
}
