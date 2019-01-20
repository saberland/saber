---
title: Routing
---


Saber uses file-system as the router API, files with `.js` `.md` or `.vue` extension inside `./pages` folder will automatically become _web pages_.


- `./pages/index.md` becomes `/index.html`
- `./pages/about.md` becomes `/about.html`
- `./pages/docs/index.md` becomes `/docs/index.html`
- and so on..


A page is made of two parts, the attributes and the contents. For example your markdown page might look like this:

```markdown
---
title: About me
---

This is somethine about __me__.
```

We allow you to define attributes via _frontmatter_, and the rest will become _contents_.

In a `.js` or `.vue`, you can define attributes via JavaScript instead.

<small>_about.js:_</small>

```js
export const attributes = {
  title: 'About me'
}

export default {
  render(h) {
    return h('h1', null, ['About me'])
  }
}
```

<small>_about.vue:_</small>

```vue
<template>
  <div>This is somethine about <strong>me</strong>.</div>
</template>

<script>
export const attributes = {
  title: 'About'
}

export default {}
</script>
```

## Posts

Posts live inside `./pages/_posts`, they are just a special kind of pages.

Basically we will generate a list of posts so you can display it in your homepage, the posts are sorted by the creation time which might be inaccurate so you can use `date: 2018-02-31` attribute to override it.
