## @magic/core

this is the @magic core library.

[![NPM version][npm-image]][npm-url]
[![Node version][node-image]][node-url]
[![Linux Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

builds a webapp with deeply nested component structure and globally/locally shared state and actions.

client html + css + js boilerplate = ~15kb uncompressed.

to get more information,
head to the [docs / demo](https://magic.github.io/core/)

other related github organizations:
* [@magic-modules](https://magic-modules.github.io) - building blocks for your app
* [@magic-themes](https://magic-themes.github.io) - themes for your app
* [@magic-libraries](https://magic-libraries.github.io) - client libraries

#### changelog

##### 0.0.1
first commit

##### 0.0.2
use @magic npm packages instead of github for installs

##### 0.0.3
* update dependencies
* make @magic actually work in the client if @magic-modules/gdpr is not installed.

##### 0.0.4
* dev server now correctly redirects urls if the trailing slash is missing
* html and markdown files can include state and variables

##### 0.0.5
* @magic-themes can now add variables to the css colors without overwriting the default colors
* @magic-modules/messages gets autoloaded if it is installed.
* components now can be nested without array. div([p('text')]) can also be div(p('text'))
* Link({ to: '#hashLink' }) is local now
* very early blog implementation. it works, but the archive pages need more work.

##### 0.0.6
always delete .tmp dir

##### 0.0.7
fix 404 page regression

##### 0.0.8 - unreleased
* blog/year/month archive pages are not 404'ing.
* blog archive pages now have links in them if needed
  (year page links to each month archive page)
* blog posts are wrapped in BlogPost automagically.
  BlogPost adds header and description automagically.
* config.HOIST allows adding any module at the bottom of the page (gdpr, messages will use that)

##### 0.0.9
* config.HOIST can be an array or a string

##### 0.0.10
* config.HOIST defaults to empty array
* app.actions.gdpr will only be added if Gdpr is included in config.HOIST

##### 0.0.11
* allow arbitrary, module and page level init effects for initialState

##### 0.0.12
* add SkipLink for screen readers. hash links to page start
* libraries can now be named with a - in their name and get camelCased

##### 0.0.13
* svg tags are actually usable now. except color-profile and switch.

##### 0.0.14
* update @magic/css which updates postcss
* color theme vars now export grey and bluegrey. copies gray and bluegray.
* config.BABEL is now being used for babel build
* config.THEME_VARS can be a function. gets passed { colors } if it is a function.

##### 0.0.15
regression: babel should minify files on build.

##### 0.0.16
* modules/MenuItem: only add submenu ul if submenu has items.length > 0
* link menu parent .to only gets prepended to link.to if link.to starts with - or #, not if it starts with /.
* add modules/MenuLink. use it in modules/MenuItem

##### 0.0.17
* **commonjs support is gone.**
* **minimum node version bumped to 13.5.0**
* modules/Router.mjs: Link module now accepts action as prop
* modules/Router.mjs: scroll page back to top if the clicked link points to current page root

##### 0.0.18
do not error if docs/sri-hashes.json does not exist

##### 0.0.19
**minimum node version of dependencies bumped to 13.5.0**

##### 0.0.20
* update dependencies
* update theme to show list-style for ordered lists (ol)
* better error handling
* remove lib/fs, use @magic/fs everywhere
* is @magic/types for isUpperCase and isLowerCase

##### 0.0.21
add viewport and ie=edge html meta tags.

##### 0.0.22
tasks/prepare/css: also load themes directly from node_modules/${theme_name}.

##### 0.0.23
* all hail eris!
* css styles now inherit THEME_VARS from all possible source before transpiling styles.
* colors.bluegrey now is alias for colors.bluegray instead of undefined.
* client side routing scrolls to top in all cases, but is not animated.
  scroll-behavior + window.scroll() = bug

##### 0.0.24
* Router: set document.title on pushstate if possible
* Seo: add image for social previews

##### 0.0.25
* fix: do not error if none of the pages has state.title set.

##### 0.0.26
config.IGNORED_STATIC is an array. can include path ('/file.ext') or extension ('.ext') strings.

##### 0.0.27
do not create sri-hashes for config.IGNORED_STATIC files

##### 0.0.28
themes can export Modules now, which can overwrite builtins.

##### 0.0.29
fix some edgecases with exported theme modules

##### 0.0.30
local config.THEME_VARS get deep merged over theme provided THEME_VARS now.

##### 0.0.31
if multiple themes are installed,
the last imported theme will overwrite earlier imported themes and their vars.

##### 0.0.32
fix race condition in case of multiple themes.
modules did not always get overwritten in the correct order.

##### 0.0.33
MenuItem: fix link handling for rooted links. initial / will not be removed from links.

##### 0.0.34
* themes: merge state, actions, effects, and subscriptions into app.
* maybeApp import: only suppress error if it is E_MODULE_NOT_FOUND.

##### 0.0.35
fix: hash routing in webkit works (chromium, brave tested)

##### 0.0.36
modules/app: correctly merge maybeApp and theme state, actions, effects and subscriptions.

##### 0.0.37
* config: IGNORED_STATIC can be a string.
* config: items in IGNORED_STATIC do not have to start with a dot. will be added if it is missing.
* babel errors tell us to run `npm run format` to find the source of the error. Sourcemaps tbd
* build worker process should always exit with process.exit(1), not panic.

##### 0.0.38
* babel: do not mangle toplevel names. broke builds, adds 1kb+ to js. investigate, exterminate.

##### 0.0.39
* only load Modules from theme if their names are CamelCased.
* handle state as a function in all imports, call it with config param
* @magic/transform handles @magic-modules now, which makes pure markdown pages possible.

##### 0.0.40
fix: HOISTing broke in 0.0.39

##### 0.0.41
hoisting happens in the footer.

##### 0.0.42
fix: theme modules are now getting imported again.

##### 0.0.43
update @magic/transmute: @magic-modules in markdown are no longer wrapped in p tags

##### 0.0.44 - unreleased
...

[npm-image]: https://img.shields.io/npm/v/@magic/core.svg
[npm-url]: https://www.npmjs.com/package/@magic/core
[node-image]: https://img.shields.io/node/v/@magic/core/latest
[node-url]: https://www.npmjs.com/package/@magic/core
[travis-image]: https://img.shields.io/travis/com/magic/core/master
[travis-url]: https://travis-ci.com/magic/core
[appveyor-image]: https://img.shields.io/appveyor/ci/magic/core/master.svg
[appveyor-url]: https://ci.appveyor.com/project/magic/core/branch/master
[coveralls-image]: https://coveralls.io/repos/github/magic/core/badge.svg
[coveralls-url]: https://coveralls.io/github/magic/core
[greenkeeper-image]: https://badges.greenkeeper.io/magic/core.svg
[greenkeeper-url]: https://badges.greenkeeper.io/magic/core.svg
[snyk-image]: https://snyk.io/test/github/magic/core/badge.svg
[snyk-url]: https://snyk.io/test/github/magic/core
