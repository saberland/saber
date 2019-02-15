---
title: Routing
layout: docs
---


Saber uses the file-system as the router API. Files with `.js` `.md` or `.vue` extension inside the `./pages` folder will automatically become _web pages_.


- `./pages/index.md` becomes `/index.html`
- `./pages/about.md` becomes `/about.html`
- `./pages/docs/index.md` becomes `/docs/index.html`
- and so on..


A page is made of two parts, the attributes and the contents. For example your markdown page might look like this:

```markdown
---
title: About me
---

This is something about __me__.
```

We allow you to define attributes via _frontmatter_, and any content outside of the frontmatter become _contents_.

In `.js` or `.vue` files, you can define attributes via JavaScript instead.

<small>_about.js:_</small>

```javascript
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
  <div>This is something about <strong>me</strong>.</div>
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

Basically we generate a list of posts for display in your homepage. Posts are sorted by their creation time which might be inaccurate, so you can override a post's creation time by adding the `date` attribute to it.


```javascript
export const attributes = {
  title: 'About me',
  date: 2018-02-31
}
```
