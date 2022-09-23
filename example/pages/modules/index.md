---
@state {
  "title": "@magic-modules",
  "description": "@magic-modules documentation."
}
---

# ${state.title}

magic modules are predefined modules for webapps.

<h2 id='definition'>module definition</h2>

the minimal module is a function that returns some html.

<Pre>
// /assets/ModuleName.mjs

// simplest module
export const View = () => div('hello, world')

// complete signature
export const View = (props = {}, children = []) => div('hello, world')
</Pre>

<h2 id='usage'>usage</h2>

if the npm package name starts with @magic-modules/ or magic-module-, it will get imported automagically.
the name of the Module will be set to a PascalCased version of the remainder of the module name.
@magic-modules/git-badges, for example, turns into GitBadges.
the same is true for all uppercased files in your /assets/ directory and subdirectories.
in the rare case where you want to install a npm module that can not be found,
you can import it in /assets/index.mjs

<Pre>
// /assets/index.mjs
export default {
  // ...otherModules

  // load module from node_modules
  NpmModule: require('not-standard-named-magic-module-from-npm'),
}
</Pre>

after this, the module will be a global in your app and can be used like any other component.

<Pre>
// any page or module
export default state => div([
  // module without props
  Mod(),
  'modules that need props: ',
  Mod({ state, customProp: true }),
</Pre>

<ModuleList></ModuleList>
