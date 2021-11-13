---
@state {
  "title": "@magic/core library docs",
  "description": "@magic/core libraries allow you to include client side functionality in your app."
}
---

# @magic/core library docs

@magic/core libraries allow you to include client side functionality in your app.

## #abstract libraries

what would javascript be without the millions of dependencies
that you can easily install and make the average webpage
slow[ly] (pun intended) grow towards a footprint of 5 megabytes.

we think that all of that bloat is unneeded, unheeded and, frankly, not optimal.

magic has one external client side dependency,
[hyperapp](https://github.com/jorgebucaran/hyperapp/),
 [~500 lines that provide our ui state machine]. thats it. and it won't change.

we also have the tendency to write libraries specialized for our usecase, see
[@magic/css](https://github.com/magic/css),
 [@magic/test](https://github.com/magic/test),
 [@magic/cli](https://github.com/magic/cli)
and others.

once there is a lib key in at least one component,
window.lib (browser) and global.lib (nodejs) will be set,
aliasing lib as a global variable in both environments

### #dir-or-file lib dir or file

if you need libraries in multiple otherwise independent modules,
it might be easier to keep your library dependencies in a central place.

to achieve this, one can simply create /assets/lib.mjs and export an object from it.
this object will get merged into the globalThis.lib object,
making it available as "lib" throughout your app.

<Pre>export default { name: () => {} }</Pre>

will turn into

<Pre>lib.name = () => {}</Pre>

### npm

all @magic-libraries and all npm packages starting with magic-library-* will be loaded automatically

#### Example

first, install a @magic-library

<Pre>
npm install --save --save-exact @magic-libraries/is
</Pre>

then, in javascript

<Pre>
export const View = props => div([
  'value is ',
  lib.is(props.value, 'string') ? '' : 'not',
  ' a string',
])
</Pre>

<LibraryList></LibraryList>
