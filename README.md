## @magic/core

This is the @magic core library.

builds a webapp with deeply nested component structure and globally/locally shared state and actions.

client html + css + js boilerplate = ~15kb uncompressed.

To get more information,
head to the [docs / demo](https://magic.github.io/core/)

other related github organizations:
* [@magic-modules](https://magic-modules.github.io) - modules, buildings block of your app
* [@magic-themes](https://magic-themes.github.io) - themes for your app
* [@magic-libraries](https://magic-libraries.github.io) - client libraries

#### changelog

##### 0.0.1
first commit

##### 0.0.2
use @magic npm packages instead of github for installs

##### 0.0.3
update dependencies
make @magic actually work in the client if @magic-modules/gdpr is not installed.

##### 0.0.4
dev server now correctly redirects urls if the trailing slash is missing
html and markdown files can include state and variables

##### 0.0.5 - unreleased
@magic-themes can now add variables to the css colors without overwriting the default colors
@magic-modules/messages gets autoloaded if it exists.

[![NPM version][npm-image]][npm-url]
[![Linux Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

[npm-image]: https://img.shields.io/npm/v/@magic/core.svg
[npm-url]: https://www.npmjs.com/package/@magic/core
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
