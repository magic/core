## Test page

This page shows various features and tests of magic functionality

### Link Tests:

* [/modules/](/modules/)
* [/modules/#gl-magic-modules](/modules/#gl-magic-modules)
* [https://magic.github.io](https://magic.github.io/)

### Broken link tests:

the following links are broken, and it's intentional for magic to warn us on every rebuild.

* [redirect link](https://magic.github.io/core)
* [broken link](https://expect-error)
* [404 link](https://en.wikipedia.org/hMdYfVaKY4btraQcgD0me6RRBDnugbpJ4FLpgJgeB7)
* ![Broken Image Link](https://broken-image-link)

### image test

while at it, let's test an image, 2 times with a working src:

* ![Magic Logo](/logo.png)
* ![Magic Logo](/core/logo.png)

and once with a broken src:

* ![Broken Magic Logo](/logo23-broken.png)

### Appending css files

<div id="AddCss">If this text is green, additional css files can be loaded using the config.ADD_CSS array</div>

```
// /magic.js

export default {
  // ...otherConfig,
  ADD_CSS: ['/addCss.css'], // points to src/assets/static/addCss.css
}

