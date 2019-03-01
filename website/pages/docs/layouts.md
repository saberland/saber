---
title: Layouts
layout: docs
---

You can use the `layout` attribute[^1] to use a layout component for specific page.

Saber uses `*.{vue,js}` files from `./layouts` in your project root and [theme](./theming.md) directory as layout components, when the desired layout component does not exist, it will fallback to the `default` layout component in your layouts directory.

Layout components have a prop named `page` which implements [Page Interface](./page-interface.md) and allows you to access page attributes and more.

The page contents will be available as a default slot in your layout component, for example:

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

[^1]: If you don't know what `page attributes` is, check out the [Pages](./pages.md) guide.
