import swc from '@swc/core'

import { /* getBabelConf, */ getSwcConf } from '../../lib/index.mjs'

export default async ({ app, config }) => {
  const swcOpts = getSwcConf(app, config)
  const { code } = await swc.transform(app.client, swcOpts)

  // const sw = await swc.transform(app.serviceWorker, swcOpts)
  return {
    code,
    // serviceWorker: sw.code,
  }
}

// const babelOpts = getBabelConf(app, config)

// const { code } = await babel.transform(app.client, babelOpts)
// // const sw = await babel.transform(app.serviceWorker, babelOpts)

// const magicPath = path.join(process.cwd(), '.tmp', '__magic__.js')
// await fs.writeFile(magicPath, app.client)
// console.log('wrote file', magicPath)

// const opts = swcConfig({
//   entry: {
//     web: magicPath,
//   },

//   output: {
//     path: path.join(process.cwd(), 'docs'),
//     name: 'magic.js',
//   },

//   options: {
//     minify: true,
//     jsc: {
//       minify: {
//         compress: true,
//         mangle: true,
//       },
//     },
//   },
// })

// const bundle = await swc.bundle(opts)
// console.log(bundle)
