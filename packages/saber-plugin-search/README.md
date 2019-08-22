# saber-plugin-search

Adds a hyper-fast, easy to integrate and highly customizable search to your app.

## Install

```bash
yarn add saber-plugin-search
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-search
```

Then in your Vue components, you can call `this.$fetchSearchDatabase()` to get the database that you can query from, this method returns a Promise which resolves an array of `Page` objects:

```js
;[
  {
    type: 'page',
    title: 'About this site',
    excerpt: '...',
    permalink: '/about.html'
  },
  {
    type: 'post',
    title: 'Hello World',
    excerpt: '...',
    permalink: '/posts/hello-world.html'
  }
]
```

Now you can query a keyword like this:

```js
const database = await this.$fetchSearchDatabase()
// Typically you need to get the keyword from an `input` element
// We hardcoded it for convenience
const keyword = 'hello'
const matchedResults = database.filter(page => {
  return page.title.includes(keyword) || page.excerpt.includes(keyword)
})
```

The above example simply uses `String.prototype.includes` to check if the page matches the keyword, however you can use a more powerful library like [Fuse.js](https://fusejs.io/) if you want more accurate result:

```js
import Fuse from 'fuse.js'

const options = {
  keys: [
    {
      name: 'title',
      weight: 0.6
    },
    {
      name: 'excerpt',
      weight: 0.4
    }
  ],
  shouldSort: true // sorts the results by score
}

const fuse = new Fuse(database, options)
const matchedResults = fuse.search(keyword)
```

## Plugin Options

### index

- Type: `string[]`
- Default: `['type', 'title', 'excerpt', 'permalink']`

Only specified page properties will be included in the generated database.

## License

MIT.
