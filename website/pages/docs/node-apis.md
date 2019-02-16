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

Invoked when a new page is added.

```js
exports.onCreatePage = function(page) {
  // Add an addtional field on the page
  page.foo = 'foo'
}
```

### afterPages

- Type: `(this: SaberInstance) => void | Promise<void>`

Invoked when Saber finished adding pages.
