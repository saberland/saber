---
title: Routing
layout: docs
---

## Client-side transitions with `<saber-link>`

In Saber, client-side transitions between routes can be enabled via a `<saber-link>` component. It's quite similar to Vue Router's `<router-link>` component but with more features like page prefetching.

Basic example, `./pages/index.md`:

```vue
<template>
  <div>
    <h1>Welcome to Saber!</h1>
    <saber-link to="/about.html">About</saber-link>
  </div>
</template>
```

Note that when you are using Markdown pages, internal links will be converted to `<saber-link>` automatically, and you can also reference pages using relative path, for example, `./pages/about.md`:

```markdown
[Contact us](./contact.md)
```

This will be converted to:

```vue
<saber-link :to="$saber.getPageLink('./contact.md')">
  Contact us
</saber-link>
```
