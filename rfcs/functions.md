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

### Exporting function

A function can exported just like a Vue page, only thing you need to do is setting `config.page` option:

```js
// functions/atom.xml.js

import posts from '../posts'

export default () => {
  const posts = await posts({ type: 'public' })
  const xml = generateXMLFeed(posts)
  res.end(xml)
}

export const config = {
  permalink: true
}
```

When setting `permalink` to `true, Saber automatically infers the actual link from its filename, in this case it would be `/atom.xml`. You can also set it to a `string` to use whatever permalink you want, e.g. `/subscribe/rss.xml`

