---
title: Saber Functions
layout: docs
---

Besides `pages` folder which is used to create HTML pages, you can also use `functions` folder to create pages in other formats.

## Using `functions` folder

Like how routing works in `pages` folder, if you populate a `functions/posts.json.js` you can access the rendered page at `/posts.json`.

Let's say we have a `functions/posts.json.js` as follows:

```js
export default api => {
  return api.pages
    .filter(page => !page.draft && page.type === 'posts')
    .map(page => ({ title: page.title, permalink: page.permalink }))
}
```

There're two ways to execute Saber functions in your app and get the returned value:

1. Using `embedFunction`

Use this if you want the data to be available at compile time.

```js
import { embedFunction } from 'saber/functions'

const posts = embedFunction('/posts.json')
```

In this way, Saber will request `/posts.json` and replace `embedFunction('/posts.json')` with actual result at compile time, no HTTP requests will be performed at runtime.

2. Using `requestFunction`

Use this if you only fetch the data on the client-side (when the app is mounted, e.g. load next page).

```js
import { requestFunction } from 'saber/functions'

const posts = await requestFunction('/posts.json')
```

In this way, Saber will request `/posts.json` and return the result.

## Dynamic functions

You can have dynamic functions like `functions/posts/[page].json.js`:

```js
export default (api, params) => {
  const { page } = params
  return somehowGetPostsByPage(api, page)
}
```

Then request the function in your app:

```js
import { requestFunction } from 'saber/functions'

let currentPage = 1

const getMorePosts = page => {
  return requestFunction(`/posts/${page}.json`)
}

const posts = await getMorePosts(currentPage++)
```
