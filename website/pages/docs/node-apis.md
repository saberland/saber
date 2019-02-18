---
title: Saber Node APIs
layout: docs
---

## Usage

Implement any of these APIs by exporting them from a file named `saber-node.js` in the root of your project.

During developing, changes made in this file will trigger rebuilding automatically, so you don't need to restart Saber for this.

## APIs

### onCreatePage

- Type: `(this: SaberInstance, page: Page) => void`

Called when a new page is added.

```js
exports.onCreatePage = function(page) {
  // Add an addtional field on the page
  page.foo = 'foo'
}
```

### onCreatePages

- Type: `(this: SaberInstance) => void | Promise<void>`

Called when Saber finished adding pages. If you want to create a page from other pages, do it in this hook.

### chainWebpack

- Type: `(config: WebpackChain, context: Context) => void`

Called when creating [webpack-chain](https://github.com/neutrinojs/webpack-chain) instance which is used to create webpack config.

```typescript
interface Context {
  type: 'client' | 'server'
}
```

### afterBuild

- Type: `() => void | Promise<void>`

Called when webpack build is finished.

### afterGenerate

- Type: `() => void | Promise<void>`

Called when static HTML files are generated.
