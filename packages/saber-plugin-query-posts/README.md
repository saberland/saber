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
      <li v-for="post in page.posts" :key="post.permalink">
        <a :href="post.permalink">
          {{ post.title }}
        </a>
      </li>
    </ul>

    <a :href="page.pagination.prevLink" v-if="page.pagination.hasPrev">
      ← Prev Page
    </a>
    <a :href="page.pagination.nextLink" v-if="page.pagination.hasNext">
      Next Page →
    </a>
  </div>
</template>

<script>
export default {
  props: ['page']
}
</script>
```

## Draft Posts

Posts with front matter `draft: true` will be excluded in `page.posts`, but they will still be built and accessible via permalink.

## Tags

This plugin will automatically generate tag pages at `/tags/:tag` when you're using `tags` in page data, e.g. in a Markdown post:

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

### Data Injected in Post Pages

You can access the detailed info of the tags of a post page via `this.page.tagsInfo`, for instance:

```yaml
tags:
  - life
  - random
```

gives you:

```js
;[
  {
    name: 'life',
    permalink: '/tags/life'
  },
  {
    name: 'random',
    permalink: '/tags/random'
  }
]
```

### Tag Layout

Tag pages will use the `tag` layout or fallback to `default` layout.

You can access the tag name in the layout component via `this.page.tag`.

## Categories

This plugin will automatically generate category pages at `/categories/:tag` when you're using `categories` in page data, e.g. in a Markdown post:

```markdown
---
title: hello
date: 2019-01-01
categories:
  - sports
---

hello
```

Then there will be a `/categories/sports` page，`categories` is an array, so you can assign the post to multiple categories.

### Data Injected in Post Pages

You can access the detailed info of the categories of a post page via `this.page.categoriesInfo`, for instance:

```yaml
categories:
  - sports/football
  - hobby
```

gives you:

```js
;[
  {
    name: 'sports',
    permalink: '/categories/sports'
  },
  {
    name: 'football',
    permalink: '/categories/sports/football'
  },
  {
    name: 'hobby',
    permalink: '/categories/hobby'
  }
]
```

### Nesting Category

It also support nesting categories:

```yaml
categories:
  - sports/football
```

In this way, it will generate two pages: `/categories/sports` and `/categories/sports/football` and both of them will include this post.

### Category Layout

Category pages will use the `category` layout or fallback to `default` layout.

You can access the category name in the layout component via `this.page.category`.

## Pagination

By default we show at most 30 posts per page, but you can configure this globally using `perPage` option in `saber-config.yml`:

```yaml
plugins:
  - resolve: saber-plugin-query-posts
    options:
      perPage: 6
```

It's also possible to configure this behavior for each page separately, in a page like `pages/index.md`:

```markdown
---
injectAllPosts:
  perPage: 20
---
```

## Options

### perPage

- Type: `number`
- Default: `30`

The limit of posts to show per page.

### firstPageOnly

- Type: `boolean`
- Default: `false`

Only generate the first page of posts.

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

Same as `tagsMap` but for categories.

### permalinks

- Type: `{ category?: string, tag?: string }`
- Default: `{ category: '/categories/:slug', tag: '/tags/:slug' }`

The permalink templates for category and tag pages, available placeholders:

| placeholder | description                    |
| ----------- | ------------------------------ |
| slug        | Slugified tag / category name. |

## License

MIT.
