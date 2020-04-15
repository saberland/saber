# RFC: Saber Functions


## `functions` folder

__Functions__ are used to fetch data that you can consume in pages, let's say you have a `posts.js` inside `functions` folder:

```js
export default async ({ type }) => {
  const posts = await getAllPostsFromApi()
  return posts.filter(post => post.type === type)
}
```

Then a function called `posts` will be available and you can use it like this in a page:

```vue
<script>
export const config = {
  injectProps: {
    drafts: {
      function: 'posts',
      options: {
        type: 'draft'
      }
    }
  }
}

export default {
  props: ['drafts']
}
</script>
```

By using `injectProps` here Saber will call the function at build time and store the result as JSON file.

## Pagination

We can create pagination based on injected props:

```vue
<script>
export const config = {
  pagination: {
    byProp: 'drafts',
    perPage: 30
  },

  injectProps: {
    drafts: {
      function: 'posts',
      options: {
        type: 'draft'
      }
    }
  }
}

export default {
  props: ['drafts']
}
</script>
```

## Exporting function

A function can be exported as a page just like a normal page, only thing you need to do is setting `config.export` option to `true`:

```js
// functions/atom.xml.js

import posts from '../posts'

export default async () => {
  const posts = await posts({ type: 'public' })
  const xml = generateXMLFeed(posts)
  return xml
}

export const config = {
  export: true
}
```

When `export` is `true`, Saber automatically infers the actual link from its filename, in this case it would be `/atom.xml`. You can also set it to a `string` to use whatever permalink you want, e.g. `/subscribe/rss.xml`.

When `export` is `true`, the function can't be injected to pages via `injectProps` option.

When `export` is `true`, the function's argument would be `undefined` unless you use dynamic parameter in its filename, for example `functions/pages/[slug].json.js`:

```js
export default ({ slug }) => {
  return getPageBySlug(slug)
}

export const config = {
  export: true
}

export const getStaticPaths = () => {
  return [
    { slug: 'hello-world' },
    { slug: 'another-page' }
  ]
}
```

Because the path is dynamic you also need `getStaticPaths` to define a list of paths that need to be rendered at build time.

Now when you visit `/pages/hello-world.json`, `slug` in your function will be `'hello-world'`.


## Adding a function from plugins

```js
saber.functions.add(TheFunction, FunctionConfig)
```
