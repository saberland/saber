---
title: Page Interface
layout: docs
---

The `page` is the center of Saber's data & routing system.

The basic `page` structure is as follows:

```typescript
interface Page {
  /**
   * The attributes for this page
   * If the page is loaded from file system
   * We get `attributes` from front-matter or `export const attributes = {}`
   */
  attributes: {
    /**
     * The page type
     * It's either `page` or `post`
     */
    type: string
    /**
     * The page layout
     * Defaults to the value of `attribtues.type`
     * Fallback to `default` layout when the desired one is not found
     */
    layout?: string
    /**
     * The creation time of this page
     * If the page is loaded from file system
     * It defaults to `attributes.date` || `birthtime` of the file
     */
    createdAt?: Date
    /**
     * The updated time of this page
     * If the page is loaded from file system
     * It defaults to `attributes.updated` || `mtime` of the file
     */
    updatedAt?: Date
    /**
     * The permalink to the page
     * We infer it from `internal.relative` if it's loaded from file system
     */
    permalink: string
    /**
     * The value of `:slug` placeholder in the `permalinks` option
     * It defaults to the filename (without extension) of `internal.relative`
     */
    slug: string
    // ... And other custom fields like `title`
  }
  /**
   * Internal object is not accessible at runtime
   */
  internal: {
    /**
     * The unique ID of the page
     */
    id: string
    isFile?: boolean
    /**
     * If the page is loaded from file system
     * It will have `absolute` which is the absolute path
     * And `relative` which is the relative path to the `pages` directory
     */
    absolute?: string
    relative?: string
  }
  /**
   * The page content
   */
  content?: string
  /**
   * The type of the page content
   * By default we support `vue`, `js` and `markdown`
   * You can use custom transformer to support other types
   */
  contentType?: string
}
```
