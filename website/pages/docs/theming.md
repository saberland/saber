---
title: Theming
---

Themes are used to manage layouts, extend Saber's browser APIs and Node.js APIs.

By default Saber uses a built-in theme, if you want to use a custom theme you can simply set it in config file like this `saber-config.yml`:

```yml
theme: ./src
# or from a npm package
# call `saber-theme-simple`:
theme: simple
```

Layouts are populated under `$theme/layouts` directory.

## Layouts

Different page will use differents layout component from your theme.

|Page Type|Example|Layout Component|
|---|---|---|
|page|`pages/about.md`|`page.{vue.js}`|
|post|`pages/_posts/hello-world.md`|`post.{vue.js}`|
|index|`pages/index.vue`|`index.{vue.js}`|

Layout component can be overriden via `layout` attribute, it will fallback to `default` when the desired one is not found.

Layout component has a prop called `page` which allows you to access page attributes and more.

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
