import path from 'path'

import deep from '@magic/deep'

import error from '@magic/error'
import is from '@magic/types'

export const findThemes = async conf => {
  const { DIR, NODE_MODULES } = conf
  let { THEME } = conf

  if (THEME) {
    if (is.string(THEME)) {
      THEME = [THEME]
    }

    let modules = {}

    const url = new URL(import.meta.url)
    const dirName = path.dirname(url.pathname)

    const results = await Promise.all(
      THEME.map(async theme_name => {
        // order is meaningful.
        const themeLocations = [
          // first look if we have this theme preinstalled in @magic,
          // if so, merge it into the styles
          path.join(dirName, '..', '..', 'themes', theme_name, 'index.mjs'),
          // see if the theme is a full name of a js module in node_modules,
          // eg: @org/theme-name or theme-name
          theme_name,
          // see if this is a @magic-themes theme
          `@magic-themes/${theme_name}`,
          // see if it is installed locally,
          // either in a subdirectory
          path.join(DIR.THEMES, theme_name, 'index.mjs'),
          // or as a single mjs file
          path.join(DIR.THEMES, theme_name + '.mjs'),
          // or from a globally installed magic
          path.join(NODE_MODULES, '@magic-themes', theme_name, 'src', 'index.mjs'),
        ]

        const modules = await Promise.all(
          themeLocations.map(async location => {
            try {
              const { default: theme, ...maybeModules } = await import(location)

              return Object.fromEntries(
                Object.entries(maybeModules).map(([name, fn]) => {
                  if (is.fn(fn)) {
                    if (!modules[name]) {
                      return [name, fn]
                    } else if (modules[name].View) {
                      return [
                        name,
                        {
                          ...modules[name],
                          View: fn,
                        },
                      ]
                    } else {
                      return [name, fn]
                    }
                  } else if (is.object(fn)) {
                    if (name[0].toUpperCase() === name[0].toUpperCase()) {
                      if (!modules[name]) {
                        return [name, fn]
                      } else if (is.fn(modules[name])) {
                        return [name, { View: modules[name], ...fn }]
                      } else {
                        return [
                          name,
                          {
                            ...modules[name],
                            ...fn,
                          },
                        ]
                      }
                    }
                  }
                }),
              )
            } catch (e) {
              if (!e.code || !e.code.includes('MODULE_NOT_FOUND')) {
                throw error(e)
              }
            }
          }),
        )

        return modules.filter(a => a)
      }),
    )

    // by writing the results after awaiting them above,
    // we force correct order of merges.
    // Promise.all does not wait internally for sequential execution,
    // but await Promise.all returns ordered results.
    results.map(result => {
      if (!is.empty(result)) {
        modules = deep.merge(modules, result)
      }
    })

    return deep.flatten(modules)
  }
}
