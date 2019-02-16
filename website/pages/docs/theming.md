---
title: Theming
layout: docs
---

Themes are used to manage layouts and Saber's browser APIs and Node.js APIs.

By default Saber uses a built-in theme, if you want to use a custom theme you can simply set it in config file like this `saber-config.yml`:

```yaml
theme: ./src
# or from a npm package
# call `saber-theme-simple`:
theme: simple
```

Layouts are populated under `$theme/layouts` directory.

## Layouts

You can use the `layout` attribute to use a layout component for specific page, when the desired layout component does not exist, it will fallback to the `default` layout component in your layouts directory.

Layout components have a prop named `page` which implements [Page Interface](/docs/page-interface.html) and allows you to access page attributes and more.

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
