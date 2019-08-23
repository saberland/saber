---
title: Saber Functions
layout: docs
---

Saber functions are used to evaluate code in Node.js environment and return JSON-format data that you can embed in your app code.

## Using `functions` folder

Let's say we have a  file `functions/posts.json.js` as follows:

```js
export default api => {
  return [...api.pages]
    .filter(page => !page.draft && page.type === 'posts')
    .map(page => ({ title: page.title, permalink: page.permalink }))
}
```

Now you get a function called `/posts.json` (simply without the `.js` extension).

## Run a function

```js
import { runFunction } from 'saber/functions'

const posts = runFunction('/posts.json')
```

In this way, Saber will replace `runFunction('/posts.json')` with actual function return value at compile time, no HTTP requests will be performed at runtime.


## Adding function via Saber API

```js
api.functions.add('/posts.json', {
  handler() {
    return [/* An array of posts */]
  },
  emit: true
})
```
