---
title: Collections (using tags)
layout: docs
---

You can use tags to group pages into collections.

## A Blog Example

For a blog site, your individual post files may use a tag called `post`, but it can be whatever you want. In this example, `my-post.md` has a single tag `post`:

```markdown
---
tags: post
title: Hot Take—Social Media is Considered Harmful
---
```

This will place this `my-post.md` into the `post` collection with all other pages sharing the `post` tag. Then you can inject this collection as page data to your component with the built-in [data source](./custom-data-source.md) `$collection`:

`pages/archive.vue`

```vue
<template>
  <ul>
    <li v-for="post in page.data.posts" :key="post.title">
      {{ post.title }}
    </li>
  </ul>
</template>

<script>
export const page = {
  injectData: {
    posts: {
      source: '$collection',
      options: { tag: 'post' }
    }
  }
}

export default {
  props: ['page']
}
</script>
```
