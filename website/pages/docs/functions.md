---
title: Saber Functions
layout: docs
---

Saber functions are used to evaluate code in Node.js environment and return JSON-format data that you can embed in your app code.

## Creating a function

Let's say we have a file `functions/getPostCount.js` as follows:

```js
export default function() {
  // `this` is a reference to Saber Node API `api`
  return [...this.pages].filter(page => !page.draft && page.type === 'posts')
    .length
}
```

Now you'll have a function call `getPostCount`.

## Using a function

```js
import { getPostCount } from 'saber/functions'

const count = getPostCount()
//=> Number
```

All functions are used synchonounsly even if it returns a Promise.

## Function arguments

You can pass arguments to the function you're calling, let's say we have a function `functions/getPageCountByType.js`:

```js
export default function({ type }) {
  // `this` is a reference to Saber Node API `api`
  return [...this.pages].filter(page => !page.draft && page.type === type)
    .length
}
```

Then call it in your app code:

```js
import { getPageCountByType } from 'saber/functions'

const count = getPageCountByType({ type: 'post' })
```

Note that the argument must be able to be evaluated at compile time, and has a fixed value, some incorrect examples:

```js
// ❌ `window.__OPTIONS__` is only available at runtime
getPageCountByType(window.__OPTIONS__)

// ❌ `this.pageType` is only available at runtime
getPageCountByType({ type: this.pageType })

// ❌ `Math.random()` is not a fixed value.
getPageCountByType({ type: Math.random() })

// ❌ `Date.now()` is not a fixed value.
getPageCountByType({ type: Date.now() })
```
