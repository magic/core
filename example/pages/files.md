---
@state {
  "title": "@magic/core files",
  "description": "@magic/core directory docs."
}
---

# @magic/core files

There are multiple magic files and directories.

* /pages - files in the page directory map to urls in your app.
* /assets - custom components, @magic-modules get imported here
* /assets/static - static files
* /assets/themes - theme directory, @magic-themes get imported here
* /assets/lib.mjs - imports npm and local but external packages into your app
* /app.mjs - gets merged into the app, can set state, actions, style here
* /config.mjs - custom config for your app
* /assets/Menu.mjs - custom Menu for your app

## /pages

the pages dir contains the pages of your webapp.

each page has it's own state and actions,
but also inherits the global state and actions from the app and it's dependencies

### #pages-dir-structure pages directory to url map

for the domain mag.ic:

<Pre>
/pages/index.mjs === http://mag.ic/
/pages/pageName.mjs === http://mag.ic/pageName/
/pages/page-name.mjs === http://mag.ic/page-name/
/pages/page_name.mjs === http://mag.ic/page_name/
/pages/dir/index.mjs === http://mag.ic/dir/
/pages/dir/name.mjs === http://mag.ic/dir/name/
</Pre>

# #pages-example example page

<Pre>
export default {
  state: {
    variable: 'test',
  },
  actions: {
    changeVar: () => ({ variable: 'changed' }),
  },
  style: {
    '.cl': {
      color: 'green',
    },
  },
  View: state => div({ class: 'cl' }, [
    'this is the page content.',
    state.variable,
  ]),
}
</Pre>

## assets

the assets dir contains custom components of your app.

you can import additional @magic-modules here

### #assets-example example /assets/index.mjs

<Pre>
export default {
  Custom: () => div('custom component'),
  Pre: require('@magic-modules/pre),
}
</Pre>

## #static /assets/static

the static dir contains all of your static assets.
every file in this directory gets copied to the public dir.
image and svg files get minified using imagemin.

text and binary files get compressed using the optional
[node-zopfli-es](https://github.com/jaeh/node-zopfli-es)
(if it is installed)

## #themes /assets/themes

the themes directory contains... themes.

a magic theme is an object of css rules, see
[@magic/css](https://github.com/magic/css/)
for more examples and documentation.

### #themes-example example theme

<Pre>
export default {
  'body': {
    color: 'blue',
  },
}
</Pre>

## #app /assets/app.mjs

the /app.mjs file allows you to set global state, actions, and styles

### #app-example example /app.mjs

<Pre>
export default {
  state: {
    globalStateVar: 'globally available',
  },
  actions: {
    globalAction: () => ({ globalStateVar: 'overwritten.' }),
  },
  style: {
    'body': {
      color: 'green',
    },
  },
}
</Pre>

## #config /config.mjs

the /config.mjs file allows you to set various aspects of your app

### #config-example example /config.mjs

<Pre>
export default {
  ROOT: 'example',
  THEME: 'blue',
  WEB_ROOT: '/core/',

  // this option adds the
  // 'X-Clacks-Overhead', 'GNU Terry Pratchet'
  // http header
  // see http://www.gnuterrypratchett.com/
  FOR_DEATH_CAN_NOT_HAVE_HIM: true,

  // default CLIENT_LIB_NAME, overwrite to change names of transpiled css and js files
  CLIENT_LIB_NAME: 'magic',
}
</Pre>

[Menu.mjs on github](https://github.com/magic/core/blob/master/src/modules/Menu.mjs)
