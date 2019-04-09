# saber-plugin-query-posts

Query posts and inject them to specific pages. Useful when you're writing a blog.

## Install

```bash
yarn add saber-plugin-query-posts
```

## Usage

In your `saber-config.yml`:

```yml
plugins:
  - resolve: saber-plugin-query-posts
```

Then this plugin will inject all posts to pages whose attribute `injectAllPosts` is set to `true`, for instance you can create a `pages/index.md`:

```markdown
---
layout: index
injectAllPosts: true
---

Welcome to my homepage.
```

Then in the layout component `layouts/index.vue`, `page.posts` and `page.pagination` will be available:

```vue
<template>
  <div>
    <slot name="default" />

    <ul>
      <li v-for="post in page.posts" :key="post.attributes.permalink">
        <saber-link :to="post.attributes.permalink">
          {{ post.attributes.title }}
        </saber-link>
      </li>
    </li>

    <saber-link :to="page.pagination.prevLink" v-if="page.pagination.hasPrev">
      ← Prev Page
    </saber-link>
    <saber-link :to="page.pagination.nextLink" v-if="page.pagination.hasNext">
      Next Page →
    </saber-link>

  </div>
</template>

<script>
export default {
  props: ['page']
}
</script>
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

### Tags Layout

Tags page will use the `tags` layout or fallback to `default` layout.

You can access the tag name in the layout component via `this.page.tag`.

## Options

### perPage

- Type: `number`
- Default: `30`

The limit of posts to show per page.

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
