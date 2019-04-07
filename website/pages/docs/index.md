---
title: Introduction
layout: docs
---

Saber (or Saber.js) is a static website generator, it is like Hexo but, you can use Vue, React or other view layers[^1] to write layouts, Saber will also generate a universal website[^2] out-of-the-box.

## Disclaimer

A word of caution: Saber is currently in beta stage. We encourage brave early adopters, it works but expect bugs large and small. We do maintain a [changelog](https://github.com/egoist/saber/releases) for breaking changes, new features and bug fixes though.

## Compared to Hexo

Hexo's layout system uses string-based template engines like ejs, pug et al. If you want client-side interactions, you need to create addtional JavaScript files and reference them in your layouts. This is pretty much the old way of building websites, which is good if that's all you need, but Saber lets you make use of more modern web frameworks.

Saber's layout system uses Vue.js by default. Layouts will be used to generate two bundles, a server bundle and a client bundle. The server bundle will be used to generate static HTML at build time, and the client bundle will be used for client-side interactions. Once the page is loaded on client-side, the client bundle will take over it to "hydrate" the static markup and make it interactive. (hence universal)

## Getting Started

Check out the [installation](./installation.md) guide.

## Routing

The center of Saber's routing API is the `pages` object, by default every `.js`, `.vue` and `.md` file in `./pages` folder will become a `page`.

Populate `./pages/index.vue` inside your project:

```vue
<template>
  <div>Welcome to Saber.js!</div>
</template>
```

And then just run `saber` and go to `http://localhost:3000`.

You can also use Saber's [Node APIs](./node-apis.md) to add pages from anywhere, e.g. REST/GraphQL API.

[^1]: Currently only Vue is officially supported.
[^2]: This means the same code is used for both generating static HTML at compile time and for client interactions in browser.
