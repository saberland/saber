---
title: Saber Instance
layout: docs
---

## source

An instance of the `Source` class.

### source.pages

An instance of the `Pages` class, it's used to store `page` ([PageInterface](./page-interface.md)).

```ts
interface Pages extends Map<id, PageInterface> {
  /**
   * Get a page with its public fields only
   * Currently we only exclude `internal` and `content` properties
   * @param id - The `id` can be a page id or the page object
   **/
  getPagePublicFields(
    id: string | PageInterface
  ): Omit<PageInterface, 'internal' | 'content'> | undefined

  /**
   * Create a new page
   * When the page already exists it will override the existing one
   **/
  createPage(page: PageInterface): void

  /**
   * Remove pages that match the given `condition`
   **/
  removeWhere(condition: ((page: PageInterface) => boolean)): void

  /**
   * Extend the `page` prop on your layout/page component
   * By default `page` prop is just the PageInterface
   * It's not recommended to mutate `page` directly to add new properties
   * That's why we have this method
   *
   * @param id - Page ID.
   * @param obj - An object to be merged by the `page` prop
   **/
  extendPageProp(id: string, obj: any): void
}
```

Here're some examples:

```js
// Get all pages as an array
const allPages = [...api.pages.values()]

// Get all posts (excluding drafts)
const allPosts = allPages.filter(
  page => page.attributes.type === 'post' && !page.attributes.draft
)

// Exclude internal fields
const allPostsWithPublicFields = allPosts.map(post =>
  api.pages.getPagePublicFields(post)
)

// Add addtional fields to the `page` prop
for (const page of api.pages.values() {
  api.pages.extendPageProp(page.internal.id, {
    foo: true
  })
  // Then you can access `this.page.foo` on your layout components
})
```

## hooks

Hooks are also known as the [Saber Nodes APIs](./node-apis.md), you can use hooks in a plugin like this:

```js
api.hooks.chainWebpack.tap('disable-sourcemap', config => {
  config.devtool(false)
})
```

This is equivalent to following code in `saber-node.js`:

```js
exports.chainWebpack = config => {
  config.devtool(false)
}
```

Hooks are [Tapable](https://github.com/webpack/tapable) instances.
