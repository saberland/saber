---
title: Pages
layout: docs
---

Saber uses the file-system as the router API. Files with `.js`, `.vue` or  `.md` extension inside `./pages` folder will automatically become _web pages_, `.js` and `.vue` pages are treated as Vue components, `.md` files will also be converted to Vue components internally.

Try this `pages/index.md`:

```markdown
Hello __Saber__!
```

And run `saber` in your project:

![page preview](@/images/simple-index-md-page.png)


- `./pages/index.md` maps to `/`
- `./pages/about.md` maps to `/about.html`
- `./pages/docs/index.md` maps to `/docs`
- and so on..

<small><i>Note: If you don't like the `.html` suffix, feel free to customize the [permalinks](./permalinks.md).</i></small>

A page is made of two parts, the page data (optional) and the page content. __Page data is a mechanism for the page component to communicate with its layout component.__

In a markdown page you can set page data with front matter:

```markdown
---
title: Hello World
layout: page
---

This is a page.
```

Then this page will use the `page` layout from your `layouts` directory or pre-configured theme directory. The page data will be available in the layout component as `page` prop, e.g. in the layout component you can access the `title` via `page.title`. The page content will be available as the default slot, you can use it like this: `<slot name="default"></slot>`. Check out [Layouts](./layouts.md) for more details.

In a `.vue` or `.js` page, you can't use front matter to set page data, instead you can use the ES `export` keyword:

```vue
<template>
  <div>This is a page.</div>
</template>

<script>
export const data = {
  title: 'Hello World',
  layout: 'page'
}
</script>
```

Note that the value of `data` must be an object literal.

## Posts

Posts live inside `./pages/_posts`, they are just a special kind of pages. The default value of `page.type` will be `post` instead of `page`.

Check out [Page Interface](./page-interface.md) for more details.
