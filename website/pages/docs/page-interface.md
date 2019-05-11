---
title: Page Interface
layout: docs
---

The `page` is the center of Saber's data & routing system.

The basic `page` structure is as follows:

```ts
interface Page {
  attributes: Attributes
  internal: Internal
  /* The raw content of this page */
  content?: string
  /**
   * The type of the content
   * For pages loaded from file system
   * `contentType` is the same as the file extension. 
   */
  contentType?: string
}
```

## Attributes

### type

- Type: `'page' | 'post'`
- Default: `'page'`

Page type.

### layout

- Type: `string`
- Default: `undefined`

The page layout.

### createdAt

- Type: `string`

The creation time of this page.

If the page is loaded from file system, it defaults to `attributes.date || file.birthtime`.

### updatedAt

- Type: `string`

The updated time of this page.

If the page is loaded from file system, it defaults to `attributes.updated || file.mtime`.

### permalink

- Type: `string`
- Required: `true`

The permalink to the page, we infer it from `internal.relative` if it's loaded from file system.

### slug

- Type: `string`
- Required: `true`

The value of `:slug` placeholder in the `permalinks` option, we infer it from the filename (without extension) of `internal.relative` if it's loaded from file system.

### assets

- Type: `{[k:string]: string}`
- Default: `{}`

Use this attribute to reference local resources and let webpack process them.

## Internal

### id

- Type: `string`
- Required: `true`

Unique page ID.

### relative

- Type: `string`

The relative path to this page, set when it's loaded from file system.

### absolute

- Type: `string`

The absolute path to this page, set when it's loaded from file system.

### isFile

- Type: `boolean`

Whether this page is loaded from file system.
