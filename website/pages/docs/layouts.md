---
title: Layouts
layout: docs
---

Layouts are Vue components that wrap around your page. They allow you to have the source code for your template in one place so you don’t have to repeat things like your navigation and footer on every page.

You can use the `layout` attribute to use a layout component for specific page.

Saber loads `*.{vue,js}` files from `./layouts` in your project root and [theme](./themes.md) directory as layout components, when the desired layout component does not exist, it will fallback to the `default` layout component in your layouts directory.

Layout components have a prop named `page` which implements [Page Interface](./page-interface.md) and allows you to access page attributes and more.

The page contents will be available as the default slot in your layout component, for example:

A page `pages/about.md`:

```markdown
---
title: Hello World
layout: page
---

Saber is fantastic!
```

and with the layout component `layouts/page.vue`:

```vue
<template>
  <div>
    <h2 class="page-title">{{ page.attributes.title }}</h2>
    <div class="page-content"><slot name="default" /></div>
  </div>
</template>

<script>
export default {
  props: ['page']
}
</script>
```

This page will be rendered to following HTML:

```html
<div>
  <h2 class="page-title">Hello World</h2>
  <div class="page-content">
    <p>Saber is fantastic!</p>
  </div>
</div>
```
