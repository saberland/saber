# saber-plugin-query-posts

Query posts and inject them to page props. Useful when you're writing a blog.

## Install

```bash
yarn add saber-plugin-query-posts
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-query-posts
    options:
      # Inject all posts to specific pages as `posts` prop
      injectPostsTo: / # Default value
```

### Tags Page

It will automatically generate tags map `/tag/:tag` when you're using `tags` in page attributes, e.g. in a Markdown post:

```markdown
---
title: hello
date: 2019-01-01
tags:
  - life
  - random
---

hello
```

Then it will generate `/tag/life` and `/tag/random` pages.

## Options

### injectPostsTo

- Type: `string` `string[]` (permalinks)
- Default: `/`

Inject all posts to specific pages.

### tagsMap

- Type: `{ [name: string]: string }`

Map tag name to permalink's `:tag` part, by default `:tag` will be the tag name.

For example:

```js
{
  tagsMap: {
    'c++': 'cpp'
  }
}
```

### categoriesMap

[TODO]

Categories are NOT IMPLEMENTED YET. I'm also not sure if we really need this since we already have tags.

## License

MIT.
