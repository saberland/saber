---
injectPageData:
  posts:
    use: posts
    options:
      draft: true
paginate:
  dataKey: posts
  perPage: 1
---

hello!

<div v-for="post in $page.posts" :key="post.title">
  {{post.title}}
</div>

Paginator: {{ JSON.stringify($page.paginator) }}
