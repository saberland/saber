---
title: Saber Functions
layout: docs
---

Besides `pages` folder which is used to create HTML pages, you can also use `functions` folder to create pages in other formats.

## Using `functions` folder

Let's say we have a  file `functions/posts.json.js` as follows:

```js
export default api => {
  return [...api.pages]
    .filter(page => !page.draft && page.type === 'posts')
    .map(page => ({ title: page.title, permalink: page.permalink }))
}
```

Now you get function called `/posts.json` (simply without the `.js` extension).

## Run a function

```js
import { runFunction } from 'saber/functions'

const posts = runFunction('/posts.json')
```

In this way, Saber will replace `runFunction('/posts.json')` with actual function return value at compile time, no HTTP requests will be performed at runtime.
