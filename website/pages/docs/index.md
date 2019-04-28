---
title: Introduction
layout: docs
---

Saber is a static website generator, it is like Hexo but, you can use Vue, React or other view layers[^1] to write layouts, Saber will also generate a universal website[^2] out-of-the-box.

<template v-slot:foo>

**foo**

</template>

## Disclaimer

A word of caution: Saber is currently in beta stage. We encourage brave early adopters, it works but expect bugs large and small. We do maintain a [changelog](https://github.com/egoist/saber/releases) for breaking changes, new features and bug fixes though.

## Comparisions

### Hexo / Hugo

Hexo's layout system uses string-based template engines like ejs, pug et al. If you want client-side interactions, you need to create addtional JavaScript files and reference them in your layouts. This is pretty much the old way of building websites, which is good if that's all you need, but Saber lets you make use of more modern web frameworks.

Saber's layout system uses Vue.js by default. Layouts will be used to generate two bundles, a server bundle and a client bundle. The server bundle will be used to generate static HTML at build time, and the client bundle will be used for client-side interactions. Once the page is loaded on client-side, the client bundle will take over it to "hydrate" the static markup and make it interactive. (hence universal)

### VuePress

VuePress and Saber both support Markdown page by default, but you can also use `.vue` or `.js` pages in Saber. VuePress has a flexible plugin system so you can pretty much build any static site with VuePress as well. Saber is like a mix of all the good stuff from Gatsby.js, Hexo and VuePress.

### Gridsome

Gridsome is a close sibling to Gatsby.js which is GraphQL based. If you want something exactly like Gatsby.js in Vue Land, Gridsome is just what you need.

## Getting Started

Check out the [installation](./installation.md) guide.

## Routing

The center of Saber's routing API is the `pages` object, by default every `.js`, `.vue` and `.md` file in `./pages` folder will become a `page`.

Populate `./pages/index.vue` inside your project:

```vue
<template>
  <div>Welcome to Saber!</div>
</template>
```

And then just run `saber` and go to `http://localhost:3000`.

You can also use Saber's [Node APIs](./node-apis.md) to add pages from anywhere, e.g. REST/GraphQL API.

[^1]: Currently only Vue is officially supported.
[^2]: This means the same code is used for both generating static HTML at compile time and for client interactions in browser.
