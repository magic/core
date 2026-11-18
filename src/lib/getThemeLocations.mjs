import path from 'node:path'

/**
 *
 * @param {object} args
 * @param {string} args.dirName
 * @param {string} args.themeName
 * @param {import('../types.mjs').ConfigDir} args.DIR
 * @param {string} args.NODE_MODULES
 */
export const getThemeLocations = ({ dirName, themeName, DIR, NODE_MODULES }) => [
  // first look if we have this theme preinstalled in @magic, if so, merge it into the styles
  path.join(dirName, '..', '..', 'themes', themeName, 'index.mjs'),
  // lets also try the index.js file for the theme.
  path.join(dirName, '..', '..', 'themes', themeName, 'index.js'),
  // see if the theme is a full name of a js module in node_modules,
  // eg: @org/theme-name or theme-name
  themeName,
  // see if this is a @magic-themes theme
  `@magic-themes/${themeName}`,
  // see if it is installed locally.
  path.join(DIR.THEMES, themeName, 'index.mjs'),
  // local theme might also use .js
  path.join(DIR.THEMES, themeName, 'index.js'),
  // if called from globally installed magic, load with absolute path
  path.join(NODE_MODULES, '@magic-themes', themeName, 'src', 'index.mjs'),
  // @magic-themes will switch to .js sometime in the future.
  path.join(NODE_MODULES, '@magic-themes', themeName, 'src', 'index.js'),
]
