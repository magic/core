---
@state
{
  "title": "markdown file example",
  "description": "markdown file description"
}
---

## ${state.title}

${state.description}

this module gets imported from a markdown file.

see [this file in the example dir](https://github.com/magic/core/blob/master/example/pages/modules/markdown.md) for an example.

any kind of markdown can be used here,
but if you use html natively,
only tags valid in a html5 body, excluding &lt;script&gt; and &lt;style&gt; tags, are accepted.

this markdown file also starts with a magic @state declaration.
it is used internally to, for example, add the title and meta rel="description" tags to the head of this html file.

* [@magic/core](https://magic.github.io)
* [@magic-libraries](https://magic-libraries.github.io)
* [@magic-modules](https://magic-modules.github.io)
* [@magic-themes](https://magic-themes.github.io)

the state looks like the following, and any valid json is allowed

```
\-\-\-
@state
{
  "title": "markdown file example",
  "description": "markdown file description"
}
\-\-\-
```
