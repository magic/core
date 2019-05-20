import path from 'path'

import is from '@magic/types'
import deep from '@magic/deep'
import { h } from 'hyperapp/src/index.js'

import { fs } from '../lib/index.mjs'

const run = async config => {
  const { WEB_ROOT = '/', LANG = 'en' } = config

  // default app state. gets merged with /assets/app.js if it exists.
  // /assets/app.js overwrites the values defined here.
  let app = {
    state: {
      url: WEB_ROOT,
      root: WEB_ROOT,
    },

    // this View gets server rendered.
    View: (page, hashes) => state => {
      state.url = page.name

      return [
        h('', { innerHTML: '<!DOCTYPE html>' }),
        html({ lang: state.lang || LANG }, [
          head([
            meta({ charset: 'utf-8' }),
            link({ rel: 'icon', href: '/favicon.ico' }),
            !is.empty(state.title) && title(state.title),
            !is.empty(state.description) &&
              meta({
                name: 'description',
                content: is.array(state.description)
                  ? state.description.join(' ')
                  : state.description,
              }),
            !is.empty(state.keywords) &&
              meta({
                name: 'keywords',
                content: is.array(state.keywords) ? state.keywords.join(' ') : state.keywords,
              }),
            !is.empty(state.author) && meta({ name: 'author', content: state.author }),
            link({
              rel: 'stylesheet',
              href: `${config.WEB_ROOT}${config.CLIENT_LIB_NAME}.css`,
              integrity: hashes.css,
              crossorigin: 'anonymous',
            }),
            page.Head && page.Head(state),
          ]),
          body([
            div({ id: 'Magic' }, Page({ page: page.View, state })),
            script({
              type: 'module',
              src: `${config.WEB_ROOT}${config.CLIENT_LIB_NAME}.js`,
              integrity: hashes.js,
              crossorigin: 'anonymous',
            }),
          ]),
        ]),
      ]
    },
  }

  let libFiles
  try {
    libFiles = await import(path.join(config.DIR.ASSETS, 'lib'))
  } catch (e) {
    // continue happily, we do not need to have a lib
  }

  app.lib = {}
  if (!is.empty(libFiles)) {
    const libPromises = Object.entries(libFiles).map(async ([name, file]) => {
      if (typeof global[name] !== 'undefined') {
        throw new Error(`Name clash: global.${name} would be overwritten by lib import`)
      }

      const localLibFile = path.join(config.DIR.ASSETS, file)
      try {
        let lib
        try {
          lib = await import(localLibFile)
          file = localLibFile
        } catch (e) {
          lib = await import(file)
        }

        if (lib) {
          app.lib[name] = file
        }
      } catch (e) {
        throw new Error(`Error in assets/lib.mjs: Could not find imported lib '${name}' in ${file}`)
      }
    })
    await Promise.all(libPromises)
  }

  try {
    const maybeAppFile = path.join(config.ROOT, 'app.mjs')
    const exists = await fs.exists(maybeAppFile)

    if (exists) {
      const { default: def, ...maybeApp } = await import(maybeAppFile)

      if (def) {
        app = deep.merge(app, { ...def })
      } else {
        app = deep.merge(app, { ...maybeApp })
      }

    }
  } catch (e) {
    // happy without maybApp
  }
  // admin
  // if (config.ENV === 'development') {
  //  app.state = deep.merge(Magic.state, app.state)
  //  app.actions = deep.merge(Magic.actions, app.actions)
  // }
  return app
}

export default run
