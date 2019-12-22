---
@state {
  "title": "blogging...",
  "description": "@magic has a blog now."
}
---

## ${state.title}

${state.description}

so i guess i should start using it...

it's pretty rough,
the index pages for yearly and monthly archives are not polished,
but can be overwritten by adding them to the config.BLOG_DIR dir of your @magic app.

to use the blog,
create an archive dir, for example
```
src/blog/2019/12/22/
```

then just add the blogposts in that directory structure.

@magic will automagically build a blog directory for you,
including the archives for yearly, monthly and overall blog posts.
