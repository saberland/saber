---
title: Pages
layout: docs
---

Saber uses the file-system as the router API. Files with `.js` `.md` or `.vue` extension (the "Page Component") inside the `./pages` folder will automatically become _web pages_.

- `./pages/index.md` becomes `/index.html`
- `./pages/about.md` becomes `/about.html`
- `./pages/docs/index.md` becomes `/docs/index.html`
- and so on..

A page component is made of two parts, the attributes (optional) and the content. __The `attributes` is a mechanism for the page component to communicate with its layout component.__

To define attributes for Markdown page you can use the front matter:

```markdown
---
title: Hello World
layout: page
---

This is a page.
```

Then this page will use the `page` layout from Saber's default theme. The page will be available in the layout component as `page` prop, you can access the attributes via `page.attributes`. The page content will be available as the default slot, you can use it like this: `<slot name="default"></slot>`. Check out [Theming](/docs/theming.html) for more details on layouts.

In a `.vue` or `.js` page, you can't use front matter, instead you can use ES `export` keyword to export the attributes:

```vue
<template>
  <div>This is a page.</div>
</template>

<script>
export const attributes = {
  title: 'Hello World',
  layout: 'page'
}
</script>
```

Note that the value of `attributes` must be a literal.

## Posts

Posts live inside `./pages/_posts`, they are just a special kind of pages. The default value of `attributes.type` will be `post` instead of `page`.

Check out [Page Interface](/docs/page-interface.html) for more details.
