# ${ state.title }

## welcome to the magic docs.

${state.description}

the goal of this document is to give you a rough @magical overview.

<GitBadges>@magic/core</GitBadges>

## philosophy

@magic aims to make it easy to stitch together any kind of webapp.
by providing simple, well documented and self contained modules,
@magic makes it possible to create stunningly fast
webpages with minimal cognitive overhead.

## privacy

@magic does not spy.

not only do we try to be legally compliant by default,
but we also aim to be ethical
which means prioritizing your rights over our needs,
but also means we prioritize the rights of your users over your needs.
we believe that this is the best compromise.

## #buzzwords why should i use magic?

### features

- static html pages with opengraph seo.
- pages are hosted for free using gitlab, github or any other git-pages style hosting.
- static css output with selector and rule deduplication.
- no javascript required where possible.
- minimal client boilerplate.
- no spyware included.
- WIP: lambda faas and graphql api generator.
- WIP: server side rendering (if needed).

### @magic is tiny

~4 kb javascript boilerplate.
usually, all the javascript in your homepage will be 30-60kb big (after unpacking),
10-30kb get transmitted from the server to the client.
this documentation page you are reading loads less than 20kb of gzipped javascript,
which, when parsing, turns into ~55kb of uncompressed javascript.
this includes all content of all subpages, no additional server requests needed for all navigations.

### @magic works without javascript

most of the functionality works without javascript,
some buttons and realtime user interactions obviously won't,
but @magic always tries to provide a non-javascript fallback via css.

### @magic generates static pages

this makes free hosting (using github or gitlab pages) possible. and it's easy.

@magic publishes to [github](https://github.com), [gitlab](https://about.gitlab.com/),
and any other git-pages enabled hosting service.

### serverless / faas

automagically generates
serverless lambdas, derived from the
[@magic-modules](https://github.com/magic-modules/)
you use in your pages.

this makes visitor statistics, user authentication and authorization,
chat, and all other server side services possible.
