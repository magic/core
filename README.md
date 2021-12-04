## @magic/core

this is the @magic core library.

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Node version][node-image]][node-url]
[![Linux Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]
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

##### 0.0.44
add Credit module

##### 0.0.45
add b, strong, i, and em styles (bold and italic)

##### 0.0.46
* no more race conditions when importing multiple themes.
* Logo link works again.

##### 0.0.47
modules/app: page.state gets inherited properly, markdown pages can see global state now.

##### 0.0.48
import originalState from transmuted bundle.

##### 0.0.49
FIX: process would hang if a markdown or html page had no state.

##### 0.0.50
document.title does not error in client if only one page exists.

##### 0.0.51

##### FULL @magic-module api available from markdown.

* nested state variables in template strings eg {{state.test.deep.var}} now work.
* replace parse5 with posthtml.
* custom markdown and custom html renderers added.
* @magic-modules in markdown and html can have keys that are arrays or objects now.
* state variables in template strings can be arrays (eg state.description).
  will be join(' ')ed

##### 0.0.52
fix: remove admin for now

##### 0.0.53
* transmute now returns empty strings instead of empty arrays and objects.

##### 0.0.54
* transmute/render/markdown.codespan: do not show line numbers for code spans.
* do not pass modules to transmute.

##### 0.0.55
@magic/transmute now correctly unescapes quot entities.

##### 0.0.56
* Credits module does not error if style variables are not set.

##### 0.0.57
tasks/prepare: module.state extends, but does not overwrite app.state when importing modules

##### 0.0.58
update @magic/transmute, which now actually replaces all occurrences of html entities in a string,
not just the first one.

##### 0.0.59
* tasks/serve/handler: use array to collect req.body data.
  strings break unicode characters if the chunks split a character on transit
* only create sri-hashes for static files in conf.INCLUDED_HASH_EXTENSIONS
* update dependencies => minimist vuln

##### 0.0.60
* modules/Router/Link.onclick: now also resets window.location.hash if the hash did not change.
* tasks/serve/handler: response data chunks are now always buffers.

##### 0.0.61
update babel and @magic/transmute

##### 0.0.62
update babel jsx and @magic/transmute

##### 0.0.63
modules/Seo now allows arbitrary header fields.

##### 0.0.64
modules/Header passes state.theme to Logo

##### 0.0.65
magic can now serve a log of mime-types. see @magic/mime-types for full list

##### 0.0.66
update dependencies

##### 0.0.67
update @magic/transmute

##### 0.0.68
@magic/transmute does not add p tags around Link and Img elements.

##### 0.0.69
update dependencies

##### 0.0.70
update dependencies

##### 0.0.71
* update dependencies
* sri-hashes.json is a flat object: key = path, value = hash

##### 0.0.72
* bump required node version
* update dependencies
* cli help expanded
* cli flags get passed to config
* better lib handling

##### 0.0.73
update dependencies.

##### 0.0.74
* src/index: export runCluster
* pkg: add type: module, add main field

##### 0.0.75
* magic build --no-minify flag now works
* themes/theme_name.mjs is now a valid theme path
* apis can be served by @grundstein/gas and created on page, app and module level

##### 0.0.76
* update dependencies
* hyperapp-render is a proper module now

##### 0.0.77
* add config.API_DIR. load all files in that dir and use their default exports as lambdas.
* update babel build task

##### 0.0.78
update babel

##### 0.0.79
* FIX: sri-hashes for magic.js and magic.css get added to html again.
* update dependencies

##### 0.0.80
update @magic/css

##### 0.0.81
* Img module now has loading=lazy as default prop.
* update @magic/css

##### 0.0.82
FIX: regression, reenable custom state for pages.

##### 0.0.83
update lodash to mitigate development environment security issue.

##### 0.0.84
update deps

##### 0.0.85
icon sizes can be customized

##### 0.0.86
update icon size usage

##### 0.0.87
themes/reset.css: add icon animation for hoisted icons

##### 0.0.88
update dependencies

##### 0.0.89
update babel

##### 0.0.90
* remove unused imports
* formatting
* split tasks/globals into separate files
* update api to allow self-contained lambdas which load their dependencies using await import
* update dependencies

##### 0.0.91
update dependencies

##### 0.0.92
update dependencies

##### 0.0.93
update dependencies

##### 0.0.94
update dependencies

##### 0.0.95
* serve/prepareApi: remove console.log
* allow addition of third party scripts using ADD_SCRIPTS config variable
* update dependencies

##### 0.0.96
git tagged but not published

##### 0.0.97
* do not error if page is not a javascript module
* update dependencies
* add app.build task
* update dependencies


##### 0.0.98
* if the app.mjs import fails because one of the app dependencies is missing,
  throw an error instead of silently not importing the app.
* update dependencies

##### 0.0.99
* use @swc/core for dev builds to make them 10 times faster.
* update dependencies
* only duplicate unique page.state into app.state, 20-30% bundle size reduction.
* cluster/build task recovers from build errors, no restart needed.

##### 0.0.100
* config.API_DIR now actually gets used
* api routes now 404 if they do not exist (redirected to WEB_ROOT before)
* update deps

##### 0.0.101
* Router: on navigation scroll to top works in newer firefox, tradeoff: probably not in older.
* npm i -g magic now works and loads local node_modules as well as global

##### 0.0.102
* further fixes regarding npm i -g magic
* bump required node version to 14.15.4
* update dependencies

##### 0.0.103
update dependencies

##### 0.0.104
update dependencies

##### 0.0.105
* Header, Menu, MenuItem and Logo arguments updated

##### 0.0.106
update dependencies (marked)

##### 0.0.107
* update dependencies
* swc now handles links in pages correctly (dev)
* babel now handles links in pages correctly (production)
* prepare task now handles all urls in the state object,
  no need to handle it in babel/swc or in modules.

##### 0.0.108
debump hyperapp-render from 4.0.0 to 3.5.0

##### 0.0.109
* fix error in modules/Logo
* tasks/prepare/stateLinks now handles #hash and -expand links without parents
* check for broken links on build and dev
* better link handling, should now include all images and links in pages too

##### 0.0.110
* update dependencies
* restructure most of the app tasks and remove global.config.
  this will allow us to seamlessly use @magic/core in the @magic/test library
* libs can now be static function instead of imports
* export renderToString

##### 0.0.111
* magic.init can now be an actual array of code, instead of string only
* update dependencies
* more robust checkLinks testing

##### 0.0.112
* libraries can be actual code or a string pointing to a file
* update hyperapp and use 2.0.12
* update hyperapp-render to 4.0.0
* update dependencies
* href link checkers handle mailto: links
* import hyperapp memo instead of Lazy
* starting to remove usages of config without explicit destructuring
* replaceSlashSlash all urls in robots.txt and sitemap.xml
* add ADD_TAGS to append arbitrary html after the #magic root
* the watch task can now watch files
* the watch task watches the config file

##### 0.0.113
* FIX: tasks/prepare/page: change variable name to avoid "access before init" error when pages do not build successfully.
* update dependencies

##### 0.0.114
* to keep dev builds fast, external links only get checked on build.
* deprecate config.mjs in favor of magic.(m)js
* magic.js config import will now error and exit if config does not exist
* if no config file is found, output an example config
* show a warning if config.mjs is still being used
* only checkLinks external links in production env

##### 0.0.115
* swc handles OptionalChainingExpression and Computed
* nicer error messages
* add Permissions-Policy interest-cohort=() to maybe avoid FLOC tracking in chrome.

##### 0.0.116
* add @magic/hyperapp bundle that exports hyperapp and hyperapp-render


##### 0.0.117
correctly export renderToString from index (for @magic/test)

##### 0.0.118
add silent option to silence log output and apply to config.

##### 0.0.119
* update dependencies
* conf.ADD_STATIC can be used to import static files from multiple directories
* component handles prerendered hyperapp objects correctly again.
* html pages have their href and src elements prefixed with WEB_ROOT

##### 0.0.120
* runConfig: bail early if config file is not found
* lib/findConfigFile: only process.exit if args.silent is false

##### 0.0.121
update dependencies

##### 0.0.122
* update @babel/preset-env to avoid security issue

* config: add PREPEND_SCRIPT and APPEND_SCRIPT to allow adding js script tags before and after the magic js
* config: add PREPEND_JS and APPEND_JS to allow adding js contents before and after the magic js, directly into magic.js
* config: add PREPEND_CSS and APPEND_CSS to allow adding css before and after magic js
* config: add PREPEND_TAGS and APPEND_TAGS to allow adding html tags before and after #magic tag


##### 0.0.123
* BUG: do not try to return an undefined hashes var if PREPEND_SCRIPTS or APPEND_SCRIPTS is empty
* swc: handle EmptyStatement
* update dependencies

##### 0.0.124
make sure all app.static[key] keys start with a slash (config.ADD_STATIC)

##### 0.0.125
* cluster.watch now also watches config.DIR.STATIC directories
* update dependencies

##### 0.0.126
update dependencies

##### 0.0.127
update dependencies to avoid circular dependency in @magic/types

##### 0.0.128
update dependencies

##### 0.0.129
update dependencies

##### 0.0.130
update dependencies

##### 0.0.131
update dependencies

##### 0.0.132
update dependencies

##### 0.0.133
update dependencies
theme: move css from html to body to prevent duplicate scrollbars in blink/webkit

##### 0.0.134 - unreleased
...

[npm-image]: https://img.shields.io/npm/v/@magic/core.svg
[npm-url]: https://www.npmjs.com/package/@magic/core
[license-image]: https://img.shields.io/npm/l/@magic/core.svg
[license-url]: https://www.npmjs.com/package/@magic/core
[node-image]: https://img.shields.io/node/v/@magic/core/latest
[node-url]: https://www.npmjs.com/package/@magic/core
[travis-image]: https://img.shields.io/travis/com/magic/core/master
[travis-url]: https://travis-ci.com/magic/core
[appveyor-image]: https://img.shields.io/appveyor/ci/magic/core/master.svg
[appveyor-url]: https://ci.appveyor.com/project/magic/core/branch/master
[coveralls-image]: https://coveralls.io/repos/github/magic/core/badge.svg
[coveralls-url]: https://coveralls.io/github/magic/core
[snyk-image]: https://snyk.io/test/github/magic/core/badge.svg
[snyk-url]: https://snyk.io/test/github/magic/core
