---
title: Theming
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

Different pages will use differents layout components from your theme.

| Page Type | Example                       | Layout Component |
| --------- | ----------------------------- | ---------------- |
| page      | `pages/about.md`              | `page.{vue.js}`  |
| post      | `pages/_posts/hello-world.md` | `post.{vue.js}`  |
| index     | `pages/index.vue`             | `index.{vue.js}` |

Layout components can be overriden via the `layout` attribute, and will fallback to the `default` component when the specificed component is not found.

Layout components have a prop called `page` which allows you to access page attributes and more.

```typescript
interface PageProp {
  attributes: object
}

interface IndexPageProp {
  attribtues: object
  posts?: Array<PageProp>
  pagination?: {
    hasNext: boolean
    hasPrev: boolean
    nextLink: string
    prevLink: string
    totalPages: number
  }
}
```

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
